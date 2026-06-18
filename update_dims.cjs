const fs = require('fs');
const path = '/home/Suhaif/Downloads/box_art_lab_project/box-art-lab/src/lib/designRules.ts';
let content = fs.readFileSync(path, 'utf8');

const updates = {
  'biriyani-box': '{ length: 16, width: 14, height: 3.5 }',
  'cheese-box': '{ length: 14, width: 14, height: 4 }',
  'fancy-tea-box': '{ length: 8, width: 6, height: 14 }',
  'instant-food-box': '{ length: 16, width: 12, height: 4.5 }',
  'nuts-spices-box': '{ length: 10, width: 4.5, height: 14 }',
  'plum-cake-box': '{ length: 10, width: 10, height: 5 }',
  'savouries-box': '{ length: 12, width: 6, height: 15 }',
  'carrier-bag': '{ length: 18, width: 11, height: 15 }',
  'festival-box': '{ length: 20, width: 20, height: 8 }',
  'gadget-box': '{ length: 6.5, width: 3, height: 14 }',
  'stand-pouch': '{ length: 10, width: 2, height: 15 }',
  'fragile-box': '{ length: 32, width: 24, height: 10 }',
  'book-mailer': '{ length: 32, width: 40, height: 8 }',
  'body-lotion-box': '{ length: 7.2, width: 7.2, height: 22 }',
  'scarf-box': '{ length: 26, width: 17, height: 2.5 }',
};

const lines = content.split('\n');
const newLines = lines.map(line => {
  if (!line.includes('defaultDimensions:')) return line;
  for (const [id, dims] of Object.entries(updates)) {
    if (line.includes(`id: '${id}'`)) {
      return line.replace(/defaultDimensions:\s*\{[^}]+\}/, `defaultDimensions: ${dims}`);
    }
  }
  return line;
});

fs.writeFileSync(path, newLines.join('\n'), 'utf8');
