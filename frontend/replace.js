const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('d:/Hieudeptraivl/noithat-main/frontend/src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    content = content.replace(/\/images\/main\/banner-/g, '/images/banners/banner-');
    content = content.replace(/\/images\/main\/banner_/g, '/images/banners/banner_');
    
    content = content.replace(/\/images\/main\/(\d+\.jpg)/g, '/images/products/');
    content = content.replace(/\/images\/main\/(bed\d*\.jpg)/g, '/images/products/');
    content = content.replace(/\/images\/main\/(sofa\d*\.jpg)/g, '/images/products/');
    
    content = content.replace(/\/images\/main\/(cafe\d*\.jpg)/g, '/images/projects/');
    content = content.replace(/\/images\/main\/(dinning\d*\.jpg)/g, '/images/projects/');
    content = content.replace(/\/images\/main\/(kitchen\d*\.jpg)/g, '/images/projects/');
    content = content.replace(/\/images\/main\/(ktchen\d*\.jpg)/g, '/images/projects/');
    content = content.replace(/\/images\/main\/(office\d*\.jpg)/g, '/images/projects/');
    content = content.replace(/\/images\/main\/(pen\d*\.jpg)/g, '/images/projects/');
    content = content.replace(/\/images\/main\/(spa\d*\.jpg)/g, '/images/projects/');
    content = content.replace(/\/images\/main\/(store\d*\.jpg)/g, '/images/projects/');
    content = content.replace(/\/images\/main\/(villa\d*\.jpg)/g, '/images/projects/');
    content = content.replace(/\/images\/main\/(rancho.*\.jpg)/g, '/images/projects/');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated ' + file);
    }
});
