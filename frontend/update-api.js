const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const userDir = path.join(__dirname, 'src/app/(user)');

walkDir(userDir, (filePath) => {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // We replace fetch('/api/something') with fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/something`)
    content = content.replace(/fetch\(['"`]\/api\/([^'"`]+)['"`]/g, "fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/$1`");

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log('Updated:', filePath);
    }
  }
});
