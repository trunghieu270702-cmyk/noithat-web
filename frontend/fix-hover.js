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

    // Fix 1: hover:text-gray-900 dark:text-white -> hover:text-gray-900 dark:hover:text-white
    content = content.replace(/hover:text-gray-900 dark:text-white/g, 'hover:text-gray-900 dark:hover:text-white');
    
    // Fix 2: If there are other hover issues
    // hover:bg-[#1F1F1F] hover:text-white dark:hover:bg-white dark:hover:text-[#131313] -> this is fine
    // text-gray-900 dark:text-white hover:text-gray-900 dark:text-white -> already fixed by Fix 1

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log('Fixed hover in:', filePath);
    }
  }
});
