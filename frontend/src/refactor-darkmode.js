const fs = require('fs');
const path = require('path');

const dashboardPath = path.join(__dirname, 'app/admin/(dashboard)');
const folders = fs.readdirSync(dashboardPath).filter(f => fs.statSync(path.join(dashboardPath, f)).isDirectory());

const replacements = [
  // Backgrounds and borders
  { from: /bg-white(?! dark:bg-)/g, to: 'bg-white dark:bg-[#14151a]' },
  { from: /bg-gray-50\/50(?! dark:bg-)/g, to: 'bg-gray-50/50 dark:bg-[#1a1b23]' },
  { from: /bg-gray-50(?! dark:bg-)(?!\/50)/g, to: 'bg-gray-50 dark:bg-[#1a1b23]' },
  { from: /border-gray-200(?! dark:border-)/g, to: 'border-gray-200 dark:border-gray-800' },
  { from: /border-gray-100(?! dark:border-)/g, to: 'border-gray-100 dark:border-gray-800' },
  
  // Text colors
  { from: /text-gray-900(?! dark:text-)/g, to: 'text-gray-900 dark:text-white' },
  { from: /text-gray-700(?! dark:text-)/g, to: 'text-gray-700 dark:text-gray-300' },
  { from: /text-gray-600(?! dark:text-)/g, to: 'text-gray-600 dark:text-gray-400' },
  { from: /text-gray-500(?! dark:text-)/g, to: 'text-gray-500 dark:text-gray-400' },
  
  // Hovers
  { from: /hover:bg-gray-50\/50(?! dark:hover:bg-)/g, to: 'hover:bg-gray-50/50 dark:hover:bg-[#262930]' },
  { from: /hover:bg-gray-50(?!\/50)(?! dark:hover:bg-)/g, to: 'hover:bg-gray-50 dark:hover:bg-[#262930]' },
  { from: /hover:bg-gray-100(?! dark:hover:bg-)/g, to: 'hover:bg-gray-100 dark:hover:bg-gray-800' },
  
  // Custom states like tags
  { from: /bg-gray-100(?! dark:bg-)/g, to: 'bg-gray-100 dark:bg-gray-800' },
  { from: /bg-emerald-50(?! dark:bg-)(?!\/50)/g, to: 'bg-emerald-50 dark:bg-emerald-500/10' },
  { from: /border-emerald-200(?! dark:border-)/g, to: 'border-emerald-200 dark:border-emerald-500/20' },
  { from: /text-emerald-700(?! dark:text-)/g, to: 'text-emerald-700 dark:text-emerald-400' },
  { from: /bg-amber-50(?! dark:bg-)(?!\/50)/g, to: 'bg-amber-50 dark:bg-amber-500/10' },
  { from: /border-amber-200(?! dark:border-)/g, to: 'border-amber-200 dark:border-amber-500/20' },
  { from: /text-amber-700(?! dark:text-)/g, to: 'text-amber-700 dark:text-amber-400' },
  { from: /bg-blue-50\/50(?! dark:bg-)/g, to: 'bg-blue-50/50 dark:bg-blue-500/10' },
  { from: /bg-blue-100(?! dark:bg-)/g, to: 'bg-blue-100 dark:bg-blue-500/20' },
  { from: /border-blue-100(?! dark:border-)/g, to: 'border-blue-100 dark:border-blue-500/20' },
  { from: /text-blue-700(?! dark:text-)/g, to: 'text-blue-700 dark:text-blue-400' },
  { from: /text-blue-600(?! dark:text-)/g, to: 'text-blue-600 dark:text-blue-400' },
  
  // Drawer background
  { from: /bg-gray-900\/40(?! dark:bg-)/g, to: 'bg-gray-900/40 dark:bg-black/60' }
];

folders.forEach(folder => {
  if (folder === 'settings') return; // already done

  const filePath = path.join(dashboardPath, folder, 'page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Apply dark mode replacements
    replacements.forEach(r => {
      content = content.replace(r.from, r.to);
    });

    // Empty state animation
    content = content.replace(/className="px-5 py-16 text-center"/g, 'className="px-5 py-16 text-center animate-in fade-in zoom-in-95 duration-500"');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${folder}/page.tsx`);
  }
});
