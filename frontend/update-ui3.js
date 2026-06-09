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

  // 1. Change font-semibold to font-medium
  if (content.includes('font-semibold')) {
    content = content.replace(/font-semibold/g, 'font-medium');
    changed = true;
  }

  // 2. Change strokeWidth={2.5} to strokeWidth={2}
  if (content.includes('strokeWidth={2.5}')) {
    content = content.replace(/strokeWidth=\{2\.5\}/g, 'strokeWidth={2}');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
