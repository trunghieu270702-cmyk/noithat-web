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
    } else if (file === 'page.tsx') {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk('d:/Hieudeptraivl/noithat-main/frontend/src/app/admin');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('>Đặt lại</button>')) {
    content = content.replace(/className=\"[^\"]*text-red-500[^\"]*\">Đặt lại<\/button>/g, 
    'className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-red-500 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ml-2"><RotateCcw strokeWidth={2} className="w-3.5 h-3.5" /> Đặt lại</button>');
    
    if (!content.includes('RotateCcw')) {
      content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/g, (m, p1) => `import {${p1}, RotateCcw} from 'lucide-react'`);
    }
    changed = true;
  }

  if (content.includes('font-bold')) {
    content = content.replace(/font-bold/g, 'font-medium');
    changed = true;
  }
  if (content.includes('font-semibold')) {
    content = content.replace(/font-semibold/g, 'font-medium');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
