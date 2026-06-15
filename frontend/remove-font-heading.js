const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const adminAppFiles = getFiles('frontend/src/app/admin');
const adminComponentsFiles = getFiles('frontend/src/admin-components');
const allFiles = [...adminAppFiles, ...adminComponentsFiles];

let changed = 0;

allFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // Replace font-heading with nothing (or font-sans if needed, but removing it defaults to body font)
  content = content.replace(/font-heading\s*/g, '');
  
  // Clean up any double spaces in classNames
  content = content.replace(/className="([^"]*)\s\s+([^"]*)"/g, 'className="$1 $2"');
  
  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    changed++;
  }
});

console.log('Removed font-heading from ' + changed + ' files.');
