const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'frontend', 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(directory);

let replacedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    // Replace all font definitions with font-['Montserrat',_sans-serif]
    content = content.replace(/font-\['Poppins'\]/g, "font-['Montserrat',_sans-serif]");
    content = content.replace(/font-\['Gallery_Modern',_sans-serif\]/g, "font-['Montserrat',_sans-serif]");
    content = content.replace(/font-\['Gallery_Modern'\]/g, "font-['Montserrat',_sans-serif]");
    content = content.replace(/font-\['Roboto'\]/g, "font-['Montserrat',_sans-serif]");
    content = content.replace(/font-\['Montserrat'\]/g, "font-['Montserrat',_sans-serif]");

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        replacedCount++;
        console.log(`Updated fonts in: ${file}`);
    }
});

console.log(`Done! Replaced fonts in ${replacedCount} files.`);
