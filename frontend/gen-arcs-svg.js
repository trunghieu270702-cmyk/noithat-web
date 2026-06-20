const fs = require('fs');

let svgElements = '';

// Large concentric arcs starting from top-left, going to bottom-right
const centerX = -50;
const centerY = 250;

for (let r = 100; r <= 600; r += 20) {
  let strokeW = r % 100 === 0 ? "0.75" : "0.25";
  // SVG Arc: M x y A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  svgElements += `<circle cx="${centerX}" cy="${centerY}" r="${r}" fill="none" stroke={strokeColor} strokeWidth="${strokeW}" opacity={strokeOpacity} />\n`;
}

// Intersecting vertical drop lines with curves at top
for (let x = 100; x <= 450; x += 30) {
  let strokeW = x % 90 === 10 ? "0.75" : "0.25";
  let yStart = 100 + (x * 0.5); // Staggered start heights
  svgElements += `<path d="M ${x} ${yStart} L ${x} 600" fill="none" stroke={strokeColor} strokeWidth="${strokeW}" opacity={strokeOpacity} />\n`;
  // Add a curved arc dropping down
  svgElements += `<path d="M ${x-50} ${yStart-50} Q ${x} ${yStart-50} ${x} ${yStart}" fill="none" stroke={strokeColor} strokeWidth="${strokeW}" opacity={strokeOpacity} />\n`;
}

fs.writeFileSync('arcs-svg-output.txt', svgElements);
