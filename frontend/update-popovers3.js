const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('dir /S /B frontend\\src\\app\\admin\\*.tsx').toString().split('\r\n').filter(Boolean);
let c = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let originalContent = content;

  // Find all popover starts
  const regex = /\{([a-zA-Z0-9_]+Popover) && \(\s*<div className="absolute ([^"]+)"([^>]*)>/g;
  let match;
  
  // We need to replace from back to front so indices don't shift
  const matches = [];
  while ((match = regex.exec(content)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      stateVar: match[1],
      classes: match[2],
      rest: match[3],
    });
  }

  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i];
    
    // Find the end of this JSX block by counting <div>s
    let openDivs = 1; // We matched the first <div
    let pos = m.index + m.length;
    let endPos = -1;
    
    // Simple parser to count <div and </div>
    while (pos < content.length) {
      if (content.substring(pos, pos + 4) === '<div') {
        openDivs++;
        pos += 4;
      } else if (content.substring(pos, pos + 6) === '</div>') {
        openDivs--;
        if (openDivs === 0) {
          endPos = pos + 6;
          break;
        }
        pos += 6;
      } else {
        pos++;
      }
    }
    
    if (endPos !== -1) {
      // First, replace the end
      const beforeEnd = content.substring(0, endPos);
      const afterEnd = content.substring(endPos);
      content = beforeEnd + '\n                </>' + afterEnd;
      
      // Then, replace the start
      const setter = 'set' + m.stateVar.charAt(0).toUpperCase() + m.stateVar.slice(1);
      const newClasses = m.classes
        .replace(/rounded-\[4px\]/g, 'rounded-lg')
        .replace(/shadow-sm( shadow-gray-[^\s]*)?/g, 'shadow-sm shadow-black/5 dark:shadow-none');
        
      const replacement = `{${m.stateVar} && (
                <>
                  <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); ${setter}(false); }} />
                  <div className="absolute ${newClasses}"${m.rest}>`;
                  
      content = content.substring(0, m.index) + replacement + content.substring(m.index + m.length);
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Fixed ' + f);
    c++;
  }
});

console.log('Total fixed: ' + c);
