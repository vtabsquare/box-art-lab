const fs = require('fs');

let readme = fs.readFileSync('README.md', 'utf8');
let guide = fs.readFileSync('USER_GUIDE.md', 'utf8');
let backup = fs.readFileSync('BACKUP_AND_RECOVERY.md', 'utf8');
let checklist = fs.readFileSync('/home/Suhaif/.gemini/antigravity/brain/cbeeb291-6515-47a6-827e-c684e5ee44a5/essentials_checklist.md', 'utf8');

// Combine
let combined = [readme, guide, backup, checklist].join('\n\n');

// Remove emojis (except ✅❌⚠️➖)
const emojisToRemove = /🌟|✨|🎨|💰|📄|🛠️|🚀|📊|📁|🤝|📜|❤️|🔴|🟡|🟢|🆕/g;
combined = combined.replace(emojisToRemove, '');

// Clean up checklist history tags
combined = combined.replace(/\s*\*\s*\(was [^*]+\)\s*\*/gi, '');

// Clean up "Updated Summary Table"
// Convert "| # | Requirement | Priority | Previous | Current | Change |"
// to "| # | Requirement | Priority | Status |"
combined = combined.replace(/\| # \| Requirement \| Priority \| Previous \| Current \| Change \|/g, '| # | Requirement | Priority | Status |');
combined = combined.replace(/\|---\|---\|---\|---\|---\|---\|/g, '|---|---|---|---|');

// Clean rows in the summary table
// E.g. "| 1 | Business Purpose | P0 | ✅ Pass | ✅ Pass | — |"
// to "| 1 | Business Purpose | P0 | ✅ Pass |"
combined = combined.replace(/(\| \d+ \| [^|]+ \| P[01] \|) (?:✅ Pass|⚠️ Partial|❌ Fail|➖ N\/A|➖ Omitted) \| (✅ Pass|⚠️ Partial|❌ Fail|➖ N\/A|➖ Omitted) \|[^|]+\|/g, '$1 $2 |');

// Clean Score Comparison table
combined = combined.replace(/\| Status \| Before \(Sep 22\) \| After \(Sep 30\) \| Delta \|/g, '| Status | Count |');
combined = combined.replace(/\|---\|---\|---\|---\|/g, '|---|---|');
combined = combined.replace(/(\| (?:✅ \*\*Pass\*\*|⚠️ \*\*Partial\*\*|❌ \*\*Fail\*\*|➖ \*\*Omitted\*\*|➖ \*\*N\/A\*\*|\*\*P0 Failures\*\*)) \| \d+ \| (\*\*\d+\*\*) \| [^|]+\|/g, '$1 | $2 |');

// Remove Remaining Action Items
const actionItemsIndex = combined.indexOf('## Remaining Action Items');
if (actionItemsIndex !== -1) {
  combined = combined.substring(0, actionItemsIndex);
}

// Ensure the document doesn't start with a '---' that might trigger YAML parsing
// The top of README has a div, then ---
combined = combined.replace(/^<div[\s\S]*?<\/div>\n\n---/m, '# Box Art Lab\n\nA Next-Generation 3D Packaging Design Studio & Dynamic Quoting Engine.');

// Save to PROFESSIONAL_DOCS.md
fs.writeFileSync('PROFESSIONAL_DOCS.md', combined);
console.log('Docs generated');
