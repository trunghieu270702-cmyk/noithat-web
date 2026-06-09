const fs = require('fs');
const path = require('path');

const root = 'd:\\Hieudeptraivl\\noithat-main';

const filesToUpdate = [
  'package.json',
  'frontend/package.json',
  'backend/package.json',
  'frontend/src/admin-utils/mockData.ts',
  'backend/prisma/mockData.ts',
  'frontend/src/app/layout.tsx',
  'frontend/src/app/admin/(dashboard)/settings/page.tsx',
  'frontend/src/app/admin/(dashboard)/operations/page.tsx',
  'frontend/src/app/admin/(dashboard)/homepage/page.tsx',
  'frontend/src/app/(user)/_components/InnovationBanner.tsx',
  'frontend/src/app/(user)/_components/Header.tsx',
  'frontend/update-homepage.js',
  'frontend/public/home.html'
];

filesToUpdate.forEach(relativePath => {
  const file = path.join(root, relativePath);
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace pawn-system
    content = content.replace(/"name":\s*"pawn-system(-frontend|-backend)?"/g, '"name": "noithat-web$1"');
    content = content.replace(/pawn-system/g, 'noithat-web');

    // Replace BIM with NoiThat
    // use word boundary so we don't replace wpbim
    content = content.replace(/\bBIM\b/g, 'NoiThat');
    content = content.replace(/bim\.com/g, 'noithat.com');

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${relativePath}`);
  } else {
    console.log(`File not found: ${relativePath}`);
  }
});
