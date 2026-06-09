const fs = require('fs');
const path = require('path');

function walk(directory) {
  let results = [];
  const list = fs.readdirSync(directory);
  list.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file === 'page.tsx' || file === 'AppLayout.tsx') {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk('d:/Hieudeptraivl/noithat-main/frontend/src/admin-components').concat(walk('d:/Hieudeptraivl/noithat-main/frontend/src/app/admin'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Fix RotateCcw
  if (content.includes('RotateCcw') && !content.includes('RotateCcw,') && !content.includes(', RotateCcw')) {
    content = content.replace(/import\s+\{([\s\S]*?)\}\s+from\s+['"]lucide-react['"]/, (match, p1) => {
      return `import { ${p1}, RotateCcw } from 'lucide-react'`;
    });
    changed = true;
  }

  // 2. Change font-medium to font-semibold
  if (content.includes('font-medium')) {
    content = content.replace(/font-medium/g, 'font-semibold');
    changed = true;
  }

  // 3. Change strokeWidth={2} to strokeWidth={2.5}
  if (content.includes('strokeWidth={2}')) {
    content = content.replace(/strokeWidth=\{2\}/g, 'strokeWidth={2.5}');
    changed = true;
  }

  // 4. Remove max-w-5xl in specific files
  if ((file.includes('operations') || file.includes('homepage')) && content.includes('max-w-5xl')) {
    content = content.replace(/max-w-5xl/g, 'w-full');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
