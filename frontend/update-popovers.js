const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = execSync('dir /S /B frontend\\src\\app\\admin\\*.tsx').toString().split('\r\n').filter(Boolean);
let c = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let originalContent = content;

  // Replace {openStatusPopover && ( <div className="absolute ..."> 
  // with <> <div fixed inset-0 /> <div ... />
  
  // We need to match the start of the popover condition
  const regex = /\{([a-zA-Z0-9_]+Popover) && \(\s*<div className="absolute ([^"]+)"([^>]*)>/g;
  
  content = content.replace(regex, (match, stateVar, classes, rest) => {
    const setter = 'set' + stateVar.charAt(0).toUpperCase() + stateVar.slice(1);
    const newClasses = classes
      .replace(/rounded-\[4px\]/g, 'rounded-lg')
      .replace(/shadow-sm( shadow-gray-[^\s]*)?/g, 'shadow-sm shadow-black/5 dark:shadow-none');
      
    return `{${stateVar} && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => ${setter}(false)} />
                  <div className="absolute ${newClasses}"${rest}>`;
  });

  // We also need to close the fragments.
  // The structure is usually:
  // {openStatusPopover && (
  //   <div className="absolute ...">
  //     <div className="flex flex-col gap-1">
  //       {...map...}
  //     </div>
  //   </div>
  // )}
  
  // To safely close the fragment, we can just replace:
  // </div>
  // )}
  // with
  // </div>
  // </>
  // )}
  // BUT we only want to do this if we actually opened a fragment!
  // It's safer to just replace `</div>\n              )}` with `</div>\n                </>\n              )}`
  // Actually, let's just use regex to find the closing tags of the popover.
  
  if (content !== originalContent) {
    // Replace the exact closing sequence for these popovers
    // Usually they end with </div></div>)} or similar.
    content = content.replace(/<\/div>\s*\}\)/g, '</div>\n                </>\n              )}');
    fs.writeFileSync(f, content, 'utf8');
    console.log('Fixed ' + f);
    c++;
  }
});

console.log('Total fixed: ' + c);
