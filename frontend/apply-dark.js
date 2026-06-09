const fs = require('fs');

const files = [
  'd:/Hieudeptraivl/noithat-main/frontend/src/app/admin/(dashboard)/operations/page.tsx',
  'd:/Hieudeptraivl/noithat-main/frontend/src/app/admin/(dashboard)/homepage/page.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace standard colors with dark mode variants
  content = content.replace(/bg-white(?!\/)/g, 'bg-white dark:bg-[#14151a]');
  content = content.replace(/border-gray-200/g, 'border-gray-200 dark:border-gray-800');
  content = content.replace(/border-gray-100/g, 'border-gray-100 dark:border-gray-800');
  content = content.replace(/text-gray-900/g, 'text-gray-900 dark:text-white');
  content = content.replace(/text-gray-800/g, 'text-gray-800 dark:text-gray-200');
  content = content.replace(/text-gray-700/g, 'text-gray-700 dark:text-gray-300');
  content = content.replace(/bg-gray-50(?!\/)/g, 'bg-gray-50 dark:bg-[#1a1b23]');
  content = content.replace(/hover:bg-gray-50(?!\/)/g, 'hover:bg-gray-50 dark:hover:bg-[#1a1b23]');
  content = content.replace(/divide-gray-200/g, 'divide-gray-200 dark:divide-gray-800');
  content = content.replace(/shadow-none/g, 'shadow-sm');

  // Fix possible duplicates like dark:bg-[#14151a] dark:bg-[#14151a]
  content = content.replace(/(dark:bg-\[#[a-fA-F0-9]+\])\s+\1/g, '$1');
  content = content.replace(/(dark:text-[a-z]+)\s+\1/g, '$1');
  content = content.replace(/(dark:border-gray-800)\s+\1/g, '$1');

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated dark mode for ' + file);
});
