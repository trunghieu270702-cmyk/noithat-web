const fs = require("fs");
const path = require("path");

const files = [
    "src/app/(user)/san-pham/[id]/page.tsx",
    "src/app/(user)/_components/Section10CTA.tsx",
    "src/app/(user)/_components/Section7Categories.tsx",
    "src/app/(user)/_components/SectionBestSellers.tsx",
    "src/app/(user)/_components/SectionHotProducts.tsx",
    "src/components/Footer.tsx",
    "src/components/Header.tsx"
];

files.forEach(file => {
    const fullPath = path.join("d:/Hieudeptraivl/noithat-main/frontend", file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, "utf8");
    const original = content;

    content = content.replace(/\/images\/main\/(\d+\.jpg)/g, "/images/products/$1");
    content = content.replace(/\/images\/main\/(bed\d*\.jpg)/g, "/images/products/$1");
    content = content.replace(/\/images\/main\/(sofa\d*\.jpg)/g, "/images/products/$1");
    
    content = content.replace(/\/images\/main\/(cafe\d*\.jpg)/g, "/images/projects/$1");
    content = content.replace(/\/images\/main\/(dinning\d*\.jpg)/g, "/images/projects/$1");
    content = content.replace(/\/images\/main\/(kitchen\d*\.jpg)/g, "/images/projects/$1");
    content = content.replace(/\/images\/main\/(ktchen\d*\.jpg)/g, "/images/projects/$1");
    content = content.replace(/\/images\/main\/(office\d*\.jpg)/g, "/images/projects/$1");
    content = content.replace(/\/images\/main\/(pen\d*\.jpg)/g, "/images/projects/$1");
    content = content.replace(/\/images\/main\/(spa\d*\.jpg)/g, "/images/projects/$1");
    content = content.replace(/\/images\/main\/(store\d*\.jpg)/g, "/images/projects/$1");
    content = content.replace(/\/images\/main\/(villa\d*\.jpg)/g, "/images/projects/$1");
    content = content.replace(/\/images\/main\/(rancho.*\.jpg)/g, "/images/projects/$1");

    if (content !== original) {
        fs.writeFileSync(fullPath, content, "utf8");
        console.log("Updated " + file);
    }
});
