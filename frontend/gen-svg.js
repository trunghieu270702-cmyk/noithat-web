const fs = require('fs');

function iso(x, y, z) {
  // standard isometric projection
  const isoX = (x - y) * Math.cos(Math.PI / 6);
  const isoY = (x + y) * Math.sin(Math.PI / 6) - z;
  return [isoX + 250, isoY + 400]; // offset to center
}

let svgElements = '';

// Draw a grid on the ground
for (let i = 0; i <= 200; i+=20) {
  let [x1, y1] = iso(i, 0, 0);
  let [x2, y2] = iso(i, 200, 0);
  svgElements += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" strokeDasharray="2 2" strokeWidth="0.25" opacity={strokeOpacity} stroke={strokeColor} />\n`;
  
  let [x3, y3] = iso(0, i, 0);
  let [x4, y4] = iso(200, i, 0);
  svgElements += `<line x1="${x3.toFixed(1)}" y1="${y3.toFixed(1)}" x2="${x4.toFixed(1)}" y2="${y4.toFixed(1)}" strokeDasharray="2 2" strokeWidth="0.25" opacity={strokeOpacity} stroke={strokeColor} />\n`;
}

// Draw a building
function drawBox(x, y, z, w, d, h) {
  let p1 = iso(x, y, z);
  let p2 = iso(x+w, y, z);
  let p3 = iso(x+w, y+d, z);
  let p4 = iso(x, y+d, z);
  let p5 = iso(x, y, z+h);
  let p6 = iso(x+w, y, z+h);
  let p7 = iso(x+w, y+d, z+h);
  let p8 = iso(x, y+d, z+h);

  // bottom
  svgElements += `<polygon points="${p1.join(',')} ${p2.join(',')} ${p3.join(',')} ${p4.join(',')}" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} opacity={strokeOpacity} />\n`;
  // top
  svgElements += `<polygon points="${p5.join(',')} ${p6.join(',')} ${p7.join(',')} ${p8.join(',')}" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} opacity={strokeOpacity} />\n`;
  // sides
  svgElements += `<line x1="${p1[0]}" y1="${p1[1]}" x2="${p5[0]}" y2="${p5[1]}" stroke={strokeColor} strokeWidth={strokeWidth} opacity={strokeOpacity} />\n`;
  svgElements += `<line x1="${p2[0]}" y1="${p2[1]}" x2="${p6[0]}" y2="${p6[1]}" stroke={strokeColor} strokeWidth={strokeWidth} opacity={strokeOpacity} />\n`;
  svgElements += `<line x1="${p3[0]}" y1="${p3[1]}" x2="${p7[0]}" y2="${p7[1]}" stroke={strokeColor} strokeWidth={strokeWidth} opacity={strokeOpacity} />\n`;
  svgElements += `<line x1="${p4[0]}" y1="${p4[1]}" x2="${p8[0]}" y2="${p8[1]}" stroke={strokeColor} strokeWidth={strokeWidth} opacity={strokeOpacity} />\n`;
}

// Core structure
drawBox(40, 40, 0, 120, 120, 300);
// Balconies / overhangs
for(let z=50; z<280; z+=40) {
  drawBox(30, 30, z, 140, 140, 10);
  // Add some vertical mullions/windows
  for(let x=40; x<=160; x+=20) {
      let [bx1, by1] = iso(x, 40, z+10);
      let [bx2, by2] = iso(x, 40, z+40);
      svgElements += `<line x1="${bx1}" y1="${by1}" x2="${bx2}" y2="${by2}" stroke={strokeColor} strokeWidth="0.25" opacity={strokeOpacity} />\n`;
  }
}
// Top spire
drawBox(80, 80, 300, 40, 40, 80);
drawBox(95, 95, 380, 10, 10, 60);

// Scaffold lines
let s1 = iso(40,40,0);
let s2 = iso(40,40,500);
svgElements += `<line x1="${s1[0]}" y1="${s1[1]}" x2="${s2[0]}" y2="${s2[1]}" stroke={strokeColor} strokeWidth="0.2" opacity={strokeOpacity} />\n`;

let s3 = iso(160,160,0);
let s4 = iso(160,160,500);
svgElements += `<line x1="${s3[0]}" y1="${s3[1]}" x2="${s4[0]}" y2="${s4[1]}" stroke={strokeColor} strokeWidth="0.2" opacity={strokeOpacity} />\n`;

fs.writeFileSync('building-svg-output.txt', svgElements);
