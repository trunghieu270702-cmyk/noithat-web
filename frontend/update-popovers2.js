const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('dir /S /B frontend\\src\\app\\admin\\*.tsx').toString().split('\r\n').filter(Boolean);

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('<div className="fixed inset-0 z-40"')) {
    let original = content;
    // Replace </div>\n              )} with </div>\n                </>\n              )}
    content = content.replace(/<\/div>(\s*)\}\)/g, '</div>$1</>$1)}');
    // Wait, the regex will double-replace if it's already fixed.
    // Let's replace ONLY if it doesn't already have </>.
    // A better approach is to undo the previous replace and do it right, but since we already replaced the opening, we can just replace the closing.
    content = content.replace(/<\/div>(\s*)\}\)/g, (match, whitespace) => {
      if (whitespace.includes('</>')) return match;
      return '</div>' + whitespace + '</>' + whitespace + '})';
    });
    
    // Actually the safest regex is:
    // /<\/div>(\s*)\}\)/g
    if (content !== original) {
      fs.writeFileSync(f, content, 'utf8');
      console.log('Fixed JSX in ' + f);
    }
  }
});
