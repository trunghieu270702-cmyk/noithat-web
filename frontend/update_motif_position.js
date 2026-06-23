const fs = require('fs');
const path = require('path');

const userDir = path.join(__dirname, 'src/app/(user)');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      walk(path.join(dir, file), fileList);
    } else if (file === 'page.tsx') {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const pageFiles = walk(userDir);

pageFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace <SectionStarryMotif /> with <SectionStarryMotif position="random-corner" />
  if (content.includes('<SectionStarryMotif />')) {
    content = content.replace(/<SectionStarryMotif \/>/g, '<SectionStarryMotif position="random-corner" />');
    fs.writeFileSync(filePath, content);
    console.log(`Updated position in ${filePath}`);
  }
});
