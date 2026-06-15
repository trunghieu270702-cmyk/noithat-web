const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else {
      if (file.endsWith('page.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = getFiles('frontend/src/app/admin/(dashboard)');
let changed = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // 1. Refactor Headlines in forms
  content = content.replace(
    /<h3 className="([^"]*)text-gray-900 dark:text-white([^"]*)uppercase tracking-wider([^"]*)">/g,
    '<h3 className="$1text-[#5865f2] dark:text-[#5865f2]$2uppercase tracking-wider$3">'
  );

  // 2. Refactor Status Colors - the default fallback
  content = content.replace(
    /'bg-gray-50 text-gray-700 border border-gray-200'/g,
    "'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300 border border-gray-200 dark:border-gray-700/50'"
  );

  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    changed++;
  }
});

console.log('Refactored ' + changed + ' files.');
