import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'content', 'upstream');

console.log('Starting content synchronization...');

if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

function syncRepo(name, url, sparseDirs = []) {
  const target = path.join(contentDir, name);
  console.log(`→ Syncing ${name}...`);
  
  try {
    if (!fs.existsSync(path.join(target, '.git'))) {
      if (sparseDirs.length === 0 || sparseDirs.includes('.')) {
        // Clone full repo
        execSync(`git clone --depth=1 "${url}" "${target}"`, { stdio: 'inherit' });
      } else {
        // Sparse clone
        execSync(`git clone --depth=1 --filter=blob:none --sparse "${url}" "${target}"`, { stdio: 'inherit' });
        execSync(`git -C "${target}" sparse-checkout set ${sparseDirs.join(' ')}`, { stdio: 'inherit' });
      }
    } else {
      // Pull latest
      execSync(`git -C "${target}" pull --depth=1`, { stdio: 'inherit' });
      if (sparseDirs.length > 0 && !sparseDirs.includes('.')) {
        execSync(`git -C "${target}" sparse-checkout set ${sparseDirs.join(' ')}`, { stdio: 'inherit' });
      }
    }
    const hash = execSync(`git -C "${target}" rev-parse --short HEAD`).toString().trim();
    console.log(`  ✓ ${name} @ ${hash}`);
    return hash;
  } catch (err) {
    console.error(`Error syncing ${name}:`, err.message);
    throw err;
  }
}

try {
  const hash1 = syncRepo(
    'ai-engineering-from-scratch',
    'https://github.com/rohitg00/ai-engineering-from-scratch',
    ['phases', 'projects', 'glossary']
  );
  
  const hash2 = syncRepo(
    'dictionary-of-ai-coding',
    'https://github.com/ZakyTm/dictionary-of-ai-coding',
    ['.']
  );
  
  const syncMeta = {
    lastSynced: new Date().toISOString(),
    repos: {
      'ai-engineering-from-scratch': hash1,
      'dictionary-of-ai-coding': hash2
    }
  };
  
  fs.writeFileSync(
    path.join(contentDir, '.sync-meta.json'),
    JSON.stringify(syncMeta, null, 2)
  );
  
  console.log('\n✓ Sync complete!');
} catch (err) {
  console.error('Fatal error during sync:', err);
  process.exit(1);
}
