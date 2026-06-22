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

    content = content.replace(/\/images\/products\//g, "/images/main/");
    content = content.replace(/\/images\/projects\//g, "/images/main/");

    if (content !== original) {
        fs.writeFileSync(fullPath, content, "utf8");
        console.log("Reverted " + file);
    }
});
