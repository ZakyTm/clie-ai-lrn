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

// Helper to parse resources from frontmatter (yaml style)
function parseManualResources(frontmatterData) {
  // If resources are written as yaml objects, we need to extract them
  // Simple structure, resources is a key in frontmatter
  if (!frontmatterData.resources) return [];
  
  // Since our simple YAML parser doesn't fully parse nested objects,
  // we'll scan the yaml text manually for resources block if it fails.
  // But let's build a dedicated parser or helper for manual concepts resources.
  return frontmatterData.resources;
}

// Domains Mapping for Automated Tagging
const phaseDomainMap = {
  '00-setup-and-tooling': 'infrastructure-ops',
  '01-math-foundations': 'llm-foundations',
  '02-ml-fundamentals': 'llm-foundations',
  '03-deep-learning-core': 'llm-foundations',
  '04-computer-vision': 'llm-foundations',
  '05-nlp-foundations-to-advanced': 'llm-foundations',
  '06-speech-and-audio': 'llm-foundations',
  '07-transformers-deep-dive': 'llm-foundations',
  '08-generative-ai': 'llm-foundations',
  '09-reinforcement-learning': 'fine-tuning',
  '10-llms-from-scratch': 'llm-foundations',
  '11-llm-engineering': 'prompt-engineering',
  '12-multimodal-ai': 'llm-foundations',
  '13-tools-and-protocols': 'mcp-tooling',
  '14-agent-engineering': 'agents',
  '15-autonomous-systems': 'agents',
  '16-multi-agent-and-swarms': 'agents',
  '17-infrastructure-and-production': 'infrastructure-ops',
  '18-ethics-safety-alignment': 'ethics-safety',
  '19-capstone-projects': 'infrastructure-ops'
};

function guessDomain(title, content = '') {
  const combined = (title + ' ' + content).toLowerCase();
  
  if (combined.includes('agent') || combined.includes('swarm') || combined.includes('autonomous system')) {
    return 'agents';
  }
  if (combined.includes('embedding') || combined.includes('cosine similarity') || combined.includes('vector space')) {
    return 'embeddings-vectors';
  }
  if (combined.includes('vector db') || combined.includes('vector database') || combined.includes('hnsw') || combined.includes('ann') || combined.includes('pgvector') || combined.includes('qdrant')) {
    return 'embeddings-vectors';
  }
  if (combined.includes('rag') || combined.includes('retrieval') || combined.includes('chunking') || combined.includes('context injection')) {
    return 'rag';
  }
  if (combined.includes('prompt') || combined.includes('few-shot') || combined.includes('system prompt') || combined.includes('cot') || combined.includes('chain of thought') || combined.includes('steering')) {
    return 'prompt-engineering';
  }
  if (combined.includes('mcp') || combined.includes('model context protocol') || combined.includes('sandbox') || combined.includes('tool call') || combined.includes('tool result')) {
    return 'mcp-tooling';
  }
  if (combined.includes('fine-tuning') || combined.includes('lora') || combined.includes('dpo') || combined.includes('rlhf') || combined.includes('adam') || combined.includes('backpropagation') || combined.includes('activation function') || combined.includes('weights')) {
    return 'fine-tuning';
  }
  if (combined.includes('cuda') || combined.includes('gpu') || combined.includes('ops') || combined.includes('docker') || combined.includes('latency') || combined.includes('caching') || combined.includes('production') || combined.includes('server')) {
    return 'infrastructure-ops';
  }
  if (combined.includes('safety') || combined.includes('ethics') || combined.includes('alignment') || combined.includes('sycophancy') || combined.includes('hallucination') || combined.includes('bias') || combined.includes('guardrail')) {
    return 'ethics-safety';
  }
  return 'llm-foundations';
}

function computeReadTime(text) {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

// Main logic
async function run() {
  console.log('Starting ingestion parsing...');
  
  const concepts = [];
  const resources = [];
  const domainConceptCounts = {};
  
  // 1. Parse Manual Concepts
  const manualDir = path.join(rootDir, 'src', 'data', 'manual-concepts');
  if (fs.existsSync(manualDir)) {
    const files = fs.readdirSync(manualDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
    console.log(`Found ${files.length} manual concepts.`);
    
    for (const file of files) {
      const filePath = path.join(manualDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Parse manual YAML frontmatter (needs custom parsing because we have complex nested list of resources)
      // For manual files, let's write a parser that detects 'resources:' block
      const { data, content } = parseFrontmatter(fileContent);
      
      // Handle resources specifically since they contain objects
      // Let's do a regex block parse for resources
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
            // parse list
            const tagsMatch = trimmed.match(/tags:\s*\[(.*)\]/);
            if (tagsMatch) {
              currentRes.tags = tagsMatch[1].split(',').map(t => t.trim().replace(/^['"]|['"]$/g, ''));
            }
          }
        }
        if (currentRes) fileResources.push(currentRes);
      }
      
      const concept = {
        id: data.id || slugify(data.title),
        title: data.title,
        domains: data.domains || ['llm-foundations'],
        difficulty: data.difficulty || 'beginner',
        summary: data.summary || '',
        body: content,
        resources: fileResources.map(r => r.id),
        related: data.related || [],
        tags: data.tags || [],
        sourceRepo: 'manual',
        lastUpdated: new Date().toISOString(),
        readTimeMinutes: computeReadTime(content),
        featured: data.featured || false
      };
      
      concepts.push(concept);
      resources.push(...fileResources);
      
      for (const d of concept.domains) {
        domainConceptCounts[d] = (domainConceptCounts[d] || 0) + 1;
      }
    }
  }
  
  // 2. Parse upstream repo 1: ai-engineering-from-scratch glossary/terms.md
  const termsPath = path.join(rootDir, 'content', 'upstream', 'ai-engineering-from-scratch', 'glossary', 'terms.md');
  if (fs.existsSync(termsPath)) {
    console.log('Parsing terms.md glossary...');
    const content = fs.readFileSync(termsPath, 'utf-8');
    
    // Split by alphabetical headers or individual concept headers
    // Since terms are split by '### TermName', let's split by '### '
    const sections = content.split('\n### ');
    
    for (let i = 1; i < sections.length; i++) {
      const section = sections[i];
      const lines = section.split('\n');
      const title = lines[0].trim();
      const bodyLines = lines.slice(1);
      
      let whatPeopleSay = '';
      let whatItActuallyMeans = '';
      let whyItsCalledThat = '';
      
      for (const line of bodyLines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('- **What people say:**')) {
          whatPeopleSay = trimmed.replace('- **What people say:**', '').trim().replace(/^['"]|['"]$/g, '');
        } else if (trimmed.startsWith('- **What it actually means:**')) {
          whatItActuallyMeans = trimmed.replace('- **What it actually means:**', '').trim().replace(/^['"]|['"]$/g, '');
        } else if (trimmed.startsWith('- **Why it\'s called that:**')) {
          whyItsCalledThat = trimmed.replace('- **Why it\'s called that:**', '').trim().replace(/^['"]|['"]$/g, '');
        }
      }
      
      const slug = slugify(title);
      // Skip if already defined manually (so manual overrides work)
      if (concepts.some(c => c.id === slug)) {
        continue;
      }
      
      const domain = guessDomain(title, section);
      
      // Build body description
      let fullBody = `## Quick Summary\n- **Common Belief**: ${whatPeopleSay || 'Not defined'}\n- **Actual Reality**: ${whatItActuallyMeans || 'Not defined'}\n`;
      if (whyItsCalledThat) {
        fullBody += `- **Origin of Name**: ${whyItsCalledThat}\n`;
      }
      
      const concept = {
        id: slug,
        title,
        domains: [domain],
        difficulty: 'beginner',
        summary: whatItActuallyMeans || whatPeopleSay || 'AI Engineering Terminology',
        body: fullBody,
        resources: [],
        related: [],
        tags: ['glossary-term', domain],
        sourceRepo: 'ai-engineering-from-scratch',
        lastUpdated: new Date().toISOString(),
        readTimeMinutes: computeReadTime(section),
        featured: false
      };
      
      concepts.push(concept);
      domainConceptCounts[domain] = (domainConceptCounts[domain] || 0) + 1;
    }
  }

  // 3. Parse upstream repo 1: ai-engineering-from-scratch glossary/myths.md
  const mythsPath = path.join(rootDir, 'content', 'upstream', 'ai-engineering-from-scratch', 'glossary', 'myths.md');
  if (fs.existsSync(mythsPath)) {
    console.log('Parsing myths.md glossary...');
    const content = fs.readFileSync(mythsPath, 'utf-8');
    
    // Split by '## '
    const sections = content.split('\n## ');
    
    for (let i = 1; i < sections.length; i++) {
      const section = sections[i];
      const lines = section.split('\n');
      const rawTitle = lines[0].trim();
      const title = rawTitle.replace(/^['"]|['"]$/g, ''); // strip quotes
      const bodyText = lines.slice(1).join('\n').trim();
      
      // Parse Reality and Why it matters
      let reality = '';
      const realityMatch = bodyText.match(/\*\*Reality:\*\*([\s\S]*?)(?:\r?\n\r?\n\*\*Why it matters:|$)/i);
      if (realityMatch) {
        reality = realityMatch[1].trim();
      }
      
      const slug = 'myth-' + slugify(title);
      if (concepts.some(c => c.id === slug)) {
        continue;
      }
      
      const domain = guessDomain(title, bodyText);
      
      const concept = {
        id: slug,
        title: `Myth: ${title}`,
        domains: [domain],
        difficulty: 'intermediate',
        summary: reality || 'Busting common AI misconceptions',
        body: bodyText,
        resources: [],
        related: [],
        tags: ['myth-busted', domain],
        sourceRepo: 'ai-engineering-from-scratch',
        lastUpdated: new Date().toISOString(),
        readTimeMinutes: computeReadTime(bodyText),
        featured: false
      };
      
      concepts.push(concept);
      domainConceptCounts[domain] = (domainConceptCounts[domain] || 0) + 1;
    }
  }

  // 4. Parse upstream repo 1: phases (Lessons)
  const phasesDir = path.join(rootDir, 'content', 'upstream', 'ai-engineering-from-scratch', 'phases');
  if (fs.existsSync(phasesDir)) {
    console.log('Parsing lessons in phases directory...');
    const walkPhases = (dir) => {
      const list = fs.readdirSync(dir);
      for (const item of list) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
          // If it is docs containing en.md, parse it
          const enMdPath = path.join(itemPath, 'docs', 'en.md');
          if (fs.existsSync(enMdPath)) {
            try {
              const fileContent = fs.readFileSync(enMdPath, 'utf-8');
              const lines = fileContent.split('\n');
              
              // Extract title
              let title = '';
              const titleLine = lines.find(l => l.trim().startsWith('# '));
              if (titleLine) {
                title = titleLine.replace('#', '').trim();
              }
              
              if (!title) {
                // fallback to folder name
                title = item.replace(/^\d+-/, '').replace(/-/g, ' ');
              }
              
              // Determine domain based on which parent folder it belongs to
              // relative path format: phases/00-setup-and-tooling/01-dev-environment
              const relativePath = path.relative(phasesDir, itemPath);
              const firstPart = relativePath.split(path.sep)[0];
              const domain = phaseDomainMap[firstPart] || 'llm-foundations';
              
              // Find metadata (e.g. Type, Time, etc.)
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
              
              // Parse time minutes
              const minutesMatch = timeStr.match(/~(\d+)\s*min/i) || timeStr.match(/(\d+)\s*min/i);
              const readTime = minutesMatch ? parseInt(minutesMatch[1], 10) : computeReadTime(fileContent);
              
              const slug = 'lesson-' + slugify(title);
              
              // Find external links as resources
              const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
              let match;
              const lessonResources = [];
              let resCounter = 1;
              
              while ((match = linkRegex.exec(fileContent)) !== null) {
                const linkText = match[1];
                const linkUrl = match[2];
                
                // Only keep real external links (not local anchors)
                if (linkUrl.startsWith('http') && !linkUrl.includes('localhost') && !linkUrl.includes('127.0.0.1')) {
                  const resId = `${slug}-res-${resCounter++}`;
                  const resourceObj = {
                    id: resId,
                    type: linkUrl.includes('github.com') ? 'github' : 
                          linkUrl.includes('arxiv.org') ? 'paper' : 'article',
                    title: linkText,
                    url: linkUrl,
                    description: `Reference link found in the lesson "${title}".`,
                    sourceRepo: 'ai-engineering-from-scratch',
                    tags: ['lesson-resource'],
                    addedAt: new Date().toISOString()
                  };
                  lessonResources.push(resourceObj);
                  resources.push(resourceObj);
                }
              }
              
              const concept = {
                id: slug,
                title,
                domains: [domain],
                difficulty,
                summary: lines.find(l => l.trim().startsWith('>'))?.replace('>', '').trim() || `Lesson on ${title}.`,
                body: fileContent,
                resources: lessonResources.map(r => r.id),
                related: [],
                tags: ['lesson', firstPart],
                sourceRepo: 'ai-engineering-from-scratch',
                lastUpdated: new Date().toISOString(),
                readTimeMinutes: readTime,
                featured: false
              };
              
              concepts.push(concept);
              domainConceptCounts[domain] = (domainConceptCounts[domain] || 0) + 1;
            } catch (err) {
              console.error(`Error parsing ${enMdPath}:`, err);
            }
          } else {
            walkPhases(itemPath);
          }
        }
      }
    };
    walkPhases(phasesDir);
  }

  // Update domains.json with dynamic count
  const domainsPath = path.join(rootDir, 'src', 'data', 'domains.json');
  if (fs.existsSync(domainsPath)) {
    const domains = JSON.parse(fs.readFileSync(domainsPath, 'utf-8'));
    for (const domain of domains) {
      domain.conceptCount = domainConceptCounts[domain.id] || 0;
    }
    fs.writeFileSync(domainsPath, JSON.stringify(domains, null, 2));
    console.log('Updated domains.json concept counts.');
  }

  // Save concepts.json
  const outConceptsPath = path.join(rootDir, 'src', 'data', 'concepts.json');
  fs.writeFileSync(outConceptsPath, JSON.stringify(concepts, null, 2));
  console.log(`Saved ${concepts.length} concepts to concepts.json.`);

  // Save resources.json
  const outResourcesPath = path.join(rootDir, 'src', 'data', 'resources.json');
  fs.writeFileSync(outResourcesPath, JSON.stringify(resources, null, 2));
  console.log(`Saved ${resources.length} resources to resources.json.`);

  // Update build-meta.json
  const buildMetaPath = path.join(rootDir, 'src', 'data', 'build-meta.json');
  const buildMetaData = {
    lastSynced: new Date().toISOString(),
    conceptCount: concepts.length,
    resourceCount: resources.length,
    domainCount: Object.keys(domainConceptCounts).length,
    syncedRepos: ['rohitg00/ai-engineering-from-scratch']
  };
  fs.writeFileSync(buildMetaPath, JSON.stringify(buildMetaData, null, 2));
  console.log('Updated build-meta.json.');
  
  console.log('Finished ingestion parsing [OK]!');
}

run().catch(err => {
  console.error('Fatal error during content ingestion:', err);
  process.exit(1);
});
