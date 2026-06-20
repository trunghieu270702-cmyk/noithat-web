const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src/app/(user)/_components');
const files = fs.readdirSync(componentsDir);

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(componentsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove specific light background colors like bg-[#FCFBF8], bg-[#F8F6F2], etc.
    const regex = /bg-\[#[F0-9A-Fa-f]{6}\]/g;
    const newContent = content.replace(regex, 'bg-transparent');
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log('Updated', file);
    }
  }
});
