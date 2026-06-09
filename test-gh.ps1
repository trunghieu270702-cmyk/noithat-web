New-Item -ItemType Directory -Force -Path ./temp-update
New-Item -ItemType Directory -Force -Path ./temp-update/bin
New-Item -ItemType Directory -Force -Path ./temp-update/prisma

Copy-Item -Path backend/dist/* -Destination ./temp-update/bin/ -Recurse -Force -Exclude "ncc"

Copy-Item -Path backend/prisma/schema.prisma -Destination ./temp-update/prisma/
Copy-Item -Path frontend/dist -Destination ./temp-update/public -Recurse -Force
Copy-Item -Path backend/release/start.bat -Destination ./temp-update/
Copy-Item -Path backend/release/update.ps1 -Destination ./temp-update/

# Thanh lọc file Prisma tránh lỗi BOM và ép về sqlite
node -e "const fs=require('fs');const p='./temp-update/prisma/schema.prisma';fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(/postgresql/g,'sqlite').replace(/@db\.Text/g,''))"

# Tự động chuyển đổi package.json gốc của monorepo thành bản release siêu sạch cho khách hàng
node -e "const fs=require('fs'); const pkg=JSON.parse(fs.readFileSync('backend/package.json', 'utf8')); delete pkg.devDependencies; for(let d in pkg.dependencies){if(pkg.dependencies[d].includes('workspace:')) delete pkg.dependencies[d];} fs.writeFileSync('./temp-update/package.json', JSON.stringify(pkg, null, 2));"

Compress-Archive -Path ./temp-update/* -DestinationPath ./release-update.zip -Force
