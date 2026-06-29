import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to slugify text
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-alphanumeric/spaces/hyphens
    .replace(/\s+/g, '-')     // replace spaces with single hyphen
    .replace(/-+/g, '-')      // collapse multiple hyphens
    .replace(/^-+/, '')       // trim leading hyphens
    .replace(/-+$/, '');      // trim trailing hyphens
}

// Simple YAML frontmatter parser
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content };
  }
  
  const yamlText = match[1];
  const bodyText = match[2];
  const data = {};
  
  const lines = yamlText.split('\n');
  let currentKey = null;
  let inArray = false;
  let arrayValues = [];
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    // Check for array item
    if (line.startsWith('-') && currentKey) {
      const val = line.substring(1).trim().replace(/^['"]|['"]$/g, '');
      if (inArray) {
        arrayValues.push(val);
      }
      continue;
    }
    
    // Normal key-value line
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      // Commit previous array if any
      if (currentKey && inArray) {
        data[currentKey] = arrayValues;
        inArray = false;
        arrayValues = [];
      }
      
      const key = line.substring(0, colonIndex).trim();
      const val = line.substring(colonIndex + 1).trim().replace(/^['"]|['"]$/g, '');
      
      if (val === '[') {
        currentKey = key;
        inArray = true;
        arrayValues = [];
      } else if (val.startsWith('[') && val.endsWith(']')) {
        // inline array like ["a", "b"]
        const items = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
        data[key] = items;
      } else if (val === '') {
        currentKey = key;
        inArray = true;
        arrayValues = [];
      } else {
        // Boolean or string
        if (val === 'true') data[key] = true;
        else if (val === 'false') data[key] = false;
        else if (!isNaN(val) && val !== '') data[key] = Number(val);
        else data[key] = val;
      }
    }
  }
  
  if (currentKey && inArray) {
    data[currentKey] = arrayValues;
  }
  
  return { data, content: bodyText };
}

function computeReadTime(text) {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

// Maps slugs in the dictionary to manual file override IDs
const slugOverrideMap = {
  'agent': 'agents',
  'mcp': 'mcp-tooling'
};

async function run() {
  console.log('Starting ingestion parsing (Option 1 Restructure)...');
  
  const terms = [];
  const phases = [];
  const resources = [];
  
  // ──── PART 1: PARSE DICTIONARY TERMS ────
  
  // 1a. Load manual/rephrased terms (legally compliant, our priority)
  const manualDir = path.join(rootDir, 'src', 'data', 'manual-concepts');
  const manualIds = new Set();
  
  if (fs.existsSync(manualDir)) {
    const files = fs.readdirSync(manualDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
    console.log(`Found ${files.length} manual rewritten terms.`);
    
    for (const file of files) {
      const filePath = path.join(manualDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      const { data, content } = parseFrontmatter(fileContent);
      const id = data.id || slugify(data.title);
      manualIds.add(id);
      
      // Parse manual resources
      const resourceBlockMatch = fileContent.match(/resources:\s*\r?\n([\s\S]*?)(?:\r?\n\w+:|\r?\n---)/);
      const fileResources = [];
      if (resourceBlockMatch) {
        const lines = resourceBlockMatch[1].split('\n');
        let currentRes = null;
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('- id:')) {
            if (currentRes) fileResources.push(currentRes);
            currentRes = { id: trimmed.split('id:')[1].trim(), sourceRepo: 'manual', tags: [] };
          } else if (currentRes && trimmed.startsWith('type:')) {
            currentRes.type = trimmed.split('type:')[1].trim();
          } else if (currentRes && trimmed.startsWith('title:')) {
            currentRes.title = trimmed.split('title:')[1].trim().replace(/^['"]|['"]$/g, '');
          } else if (currentRes && trimmed.startsWith('url:')) {
            currentRes.url = trimmed.split('url:')[1].trim().replace(/^['"]|['"]$/g, '');
          } else if (currentRes && trimmed.startsWith('description:')) {
            currentRes.description = trimmed.split('description:')[1].trim().replace(/^['"]|['"]$/g, '');
          } else if (currentRes && trimmed.startsWith('tags:')) {
            const tagsMatch = trimmed.match(/tags:\s*\[(.*)\]/);
            if (tagsMatch) {
              currentRes.tags = tagsMatch[1].split(',').map(t => t.trim().replace(/^['"]|['"]$/g, ''));
            }
          }
        }
        if (currentRes) fileResources.push(currentRes);
      }
      
      // Separate Avoid/Usage if any
      const iAvoid = content.indexOf('# AVOID\n');
      const iUsage = content.indexOf('# USAGE\n');
      let mainEnd = content.length;
      if (iAvoid !== -1) mainEnd = Math.min(mainEnd, iAvoid);
      if (iUsage !== -1) mainEnd = Math.min(mainEnd, iUsage);
      
      const body = content.slice(0, mainEnd).trim();
      
      let avoid = '';
      if (iAvoid !== -1) {
        const end = iUsage !== -1 && iUsage > iAvoid ? iUsage : content.length;
        avoid = content.slice(iAvoid, end).replace('# AVOID\n', '').trim();
      }
      
      let usage = '';
      if (iUsage !== -1) {
        usage = content.slice(iUsage).replace('# USAGE\n', '').trim();
      }
      
      terms.push({
        id,
        title: data.title,
        summary: data.summary || '',
        descriptionAr: data.descriptionAr || undefined,
        body,
        avoid: avoid || undefined,
        usage: usage || undefined,
        related: data.related || [],
        section: data.domains?.[0] || 'Unsorted',
        readTimeMinutes: computeReadTime(content),
        sourceRepo: 'manual',
        sources: data.sources || undefined,
        lastUpdated: new Date().toISOString()
      });
      
      resources.push(...fileResources);
    }
  }
  
  // 1b. Ingest dictionary-of-ai-coding README.md (Local reference dictionary terms)
  const dictionaryReadmePath = path.join(rootDir, 'content', 'upstream', 'dictionary-of-ai-coding', 'README.md');
  if (fs.existsSync(dictionaryReadmePath)) {
    console.log('Ingesting reference terms from dictionary-of-ai-coding README.md...');
    const readmeContent = fs.readFileSync(dictionaryReadmePath, 'utf-8').replace(/\r\n/g, '\n');
    
    // Split by sections: "## Section "
    const sectionsText = readmeContent.split('\n## Section ');
    
    for (let s = 1; s < sectionsText.length; s++) {
      const sectionText = sectionsText[s];
      const sectTitleLine = sectionText.split('\n')[0].trim();
      const sectionName = `Section ${sectTitleLine}`;
      
      // Split this section by term headings: "\n### "
      const termsText = sectionText.split('\n### ');
      
      for (let t = 1; t < termsText.length; t++) {
        const termBlock = termsText[t];
        const lines = termBlock.split('\n');
        const rawTitle = lines[0].trim();
        const title = rawTitle.replace(/^['"]|['"]$/g, '');
        
        let rawSlug = slugify(title);
        // Apply override redirects
        if (slugOverrideMap[rawSlug]) {
          rawSlug = slugOverrideMap[rawSlug];
        }
        
        // If we already hand-authored this term (Option 1 priority), skip this reference copy
        if (manualIds.has(rawSlug)) {
          console.log(`Skipping reference copy for "${title}" (overridden by manual file)`);
          continue;
        }
        
        const contentBody = lines.slice(1).join('\n').trim();
        
        // Parse Avoid and Usage sections
        const iAvoid = contentBody.indexOf('_Avoid:_');
        const iUsage = contentBody.indexOf('_Usage:_');
        let mainEnd = contentBody.length;
        if (iAvoid !== -1) mainEnd = Math.min(mainEnd, iAvoid);
        if (iUsage !== -1) mainEnd = Math.min(mainEnd, iUsage);
        
        const descriptionBlock = contentBody.slice(0, mainEnd).trim();
        
        let avoid = '';
        if (iAvoid !== -1) {
          const end = iUsage !== -1 && iUsage > iAvoid ? iUsage : contentBody.length;
          avoid = contentBody.slice(iAvoid, end).replace('_Avoid:_', '').trim();
        }
        
        let usage = '';
        if (iUsage !== -1) {
          usage = contentBody.slice(iUsage).replace('_Usage:_', '').trim();
        }
        
        // Extract related terms from links like [harness](#harness)
        const related = [];
        const linkRegex = /\[([^\]]+)\]\(#([^)]+)\)/g;
        let match;
        while ((match = linkRegex.exec(descriptionBlock)) !== null) {
          let relatedSlug = match[2];
          if (slugOverrideMap[relatedSlug]) relatedSlug = slugOverrideMap[relatedSlug];
          if (relatedSlug !== rawSlug && !related.includes(relatedSlug)) {
            related.push(relatedSlug);
          }
        }
        
        // Clean markdown cross-links in the description block: convert (#slug) to (/term/slug)
        let cleanedDescription = descriptionBlock.replace(/\[([^\]]+)\]\(#([^)]+)\)/g, (m, txt, target) => {
          let cleanTarget = target;
          if (slugOverrideMap[cleanTarget]) cleanTarget = slugOverrideMap[cleanTarget];
          return `[${txt}](/term/${cleanTarget})`;
        });
        
        // Split the first paragraph out as the summary
        const paragraphs = cleanedDescription.split(/\n\n+/);
        const summary = paragraphs[0] ? paragraphs[0].trim().replace(/\n/g, ' ') : '';
        const body = paragraphs.slice(1).join('\n\n').trim();
        
        terms.push({
          id: rawSlug,
          title,
          summary,
          body: body || summary, // if no body, fallback to summary
          avoid: avoid || undefined,
          usage: usage || undefined,
          related,
          section: sectionName,
          readTimeMinutes: computeReadTime(contentBody),
          sourceRepo: 'reference',
          lastUpdated: new Date().toISOString()
        });
      }
    }
  }

  // ──── PART 2: PARSE CURRICULUM PHASES & LESSONS ────
  
  const phasesDir = path.join(rootDir, 'content', 'upstream', 'ai-engineering-from-scratch', 'phases');
  if (fs.existsSync(phasesDir)) {
    console.log('Parsing curriculum phases from ai-engineering-from-scratch...');
    const phaseFolders = fs.readdirSync(phasesDir)
      .filter(f => fs.statSync(path.join(phasesDir, f)).isDirectory() && f.match(/^\d+-/));
      
    // Sort phase folders numerically
    phaseFolders.sort((a, b) => {
      const numA = parseInt(a.split('-')[0], 10);
      const numB = parseInt(b.split('-')[0], 10);
      return numA - numB;
    });
    
    for (const folder of phaseFolders) {
      const phaseId = folder;
      const phasePath = path.join(phasesDir, folder);
      
      // Make a clean title for the phase
      const phaseTitle = folder.replace(/^\d+-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const order = parseInt(folder.split('-')[0], 10);
      
      const lessons = [];
      const subdirs = fs.readdirSync(phasePath)
        .filter(f => fs.statSync(path.join(phasePath, f)).isDirectory() && f.match(/^\d+-/));
        
      subdirs.sort((a, b) => {
        const numA = parseInt(a.split('-')[0], 10);
        const numB = parseInt(b.split('-')[0], 10);
        return numA - numB;
      });
      
      for (const subdir of subdirs) {
        const lessonPath = path.join(phasePath, subdir);
        const enMdPath = path.join(lessonPath, 'docs', 'en.md');
        
        if (fs.existsSync(enMdPath)) {
          const fileContent = fs.readFileSync(enMdPath, 'utf-8');
          const lines = fileContent.split('\n');
          
          let title = '';
          const titleLine = lines.find(l => l.trim().startsWith('# '));
          if (titleLine) {
            title = titleLine.replace('#', '').trim();
          } else {
            title = subdir.replace(/^\d+-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          }
          
          let difficulty = 'beginner';
          let timeStr = '15 minutes';
          
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('**Type:**')) {
              const type = trimmed.replace('**Type:**', '').trim().toLowerCase();
              if (type.includes('build') || type.includes('project')) difficulty = 'intermediate';
              if (type.includes('advanced') || type.includes('core')) difficulty = 'advanced';
            }
            if (trimmed.startsWith('**Time:**')) {
              timeStr = trimmed.replace('**Time:**', '').trim();
            }
          }
          
          const minutesMatch = timeStr.match(/~(\d+)\s*min/i) || timeStr.match(/(\d+)\s*min/i);
          const readTime = minutesMatch ? parseInt(minutesMatch[1], 10) : computeReadTime(fileContent);
          const lessonSlug = 'lesson-' + slugify(title);
          
          // Parse links as resource pointers
          const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
          let match;
          const lessonResources = [];
          let resCounter = 1;
          
          while ((match = linkRegex.exec(fileContent)) !== null) {
            const linkText = match[1];
            const linkUrl = match[2];
            
            if (linkUrl.startsWith('http') && !linkUrl.includes('localhost') && !linkUrl.includes('127.0.0.1')) {
              const resId = `${lessonSlug}-res-${resCounter++}`;
              const resourceObj = {
                id: resId,
                type: linkUrl.includes('github.com') ? 'github' : 
                      linkUrl.includes('arxiv.org') ? 'paper' : 'article',
                title: linkText,
                url: linkUrl,
                description: `Resource link from lesson "${title}".`,
                sourceRepo: 'ai-engineering-from-scratch',
                tags: ['lesson-resource'],
                addedAt: new Date().toISOString()
              };
              lessonResources.push(resourceObj);
              resources.push(resourceObj);
            }
          }
          
          lessons.push({
            id: lessonSlug,
            title,
            phaseId,
            difficulty,
            summary: lines.find(l => l.trim().startsWith('>'))?.replace('>', '').trim() || `Lesson explaining ${title}.`,
            body: fileContent,
            resources: lessonResources.map(r => r.id),
            readTimeMinutes: readTime,
            filePath: `phases/${phaseId}/${subdir}/docs/en.md`
          });
        }
      }
      
      phases.push({
        id: phaseId,
        title: phaseTitle,
        order,
        lessons
      });
    }
  }

  // ──── PART 3: OUTPUT RESULTS ────
  
  const outDir = path.join(rootDir, 'src', 'data');
  fs.mkdirSync(outDir, { recursive: true });
  
  // Write terms.json
  fs.writeFileSync(path.join(outDir, 'terms.json'), JSON.stringify(terms, null, 2));
  console.log(`Saved ${terms.length} terms to terms.json.`);
  
  // Write curriculum.json
  fs.writeFileSync(path.join(outDir, 'curriculum.json'), JSON.stringify(phases, null, 2));
  console.log(`Saved ${phases.length} phases containing ${phases.reduce((acc, p) => acc + p.lessons.length, 0)} lessons.`);
  
  // Write resources.json
  fs.writeFileSync(path.join(outDir, 'resources.json'), JSON.stringify(resources, null, 2));
  console.log(`Saved ${resources.length} resources.`);
  
  // Write build-meta.json
  const lessonCount = phases.reduce((acc, p) => acc + p.lessons.length, 0);
  const buildMetaData = {
    lastSynced: new Date().toISOString(),
    termCount: terms.length,
    phaseCount: phases.length,
    lessonCount,
    resourceCount: resources.length
  };
  fs.writeFileSync(path.join(outDir, 'build-meta.json'), JSON.stringify(buildMetaData, null, 2));
  console.log('Saved build-meta.json.');
  
  console.log('Finished content parsing and restructure [OK]!');
}

run().catch(err => {
  console.error('Fatal error during content parsing:', err);
  process.exit(1);
});
