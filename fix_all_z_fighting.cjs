const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/components/models/*.tsx');
let totalChanges = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Find all <mesh ...> tags
  // We want to add scale={0.999} right after <mesh
  // But only if it doesn't already contain scale=
  content = content.replace(/<mesh\s+([^>]*?)>/g, (match, attrs) => {
    // If it's a self-closing mesh <mesh /> or <mesh ... />
    const isSelfClosing = attrs.trim().endsWith('/');
    const innerAttrs = isSelfClosing ? attrs.replace(/\/$/, '') : attrs;
    
    if (innerAttrs.includes('scale=')) {
      return match; // skip if already scaled
    }
    
    if (isSelfClosing) {
      return `<mesh scale={0.999} ${innerAttrs}/>`;
    } else {
      return `<mesh scale={0.999} ${innerAttrs}>`;
    }
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalChanges++;
    console.log(`Updated ${file}`);
  }
}

console.log(`Done. Updated ${totalChanges} files.`);
