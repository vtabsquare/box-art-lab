import fs from 'fs';

const utilsFile = fs.readFileSync('src/lib/utils.ts', 'utf-8');
const designRulesFile = fs.readFileSync('src/lib/designRules.ts', 'utf-8');

// Parse designRules.ts to get productName and category mapping
const productMap = {}; // { 'popcorn-box': { name: 'Popcorn Box', category: 'food' } }
const regexDesignRules = /{ id: '([^']+)', name: '([^']+)', category: '([^']+)'/g;
let match;
while ((match = regexDesignRules.exec(designRulesFile)) !== null) {
  productMap[match[1]] = {
    name: match[2],
    category: match[3].charAt(0).toUpperCase() + match[3].slice(1),
  };
}

// Parse utils.ts to get pricing
const regexPricing = /'([^']+)': \{ basePrice: ([\d.]+), sizeMultiplier: .*?\/ (\d+), designPremium: ([\d.]+)/g;
let pricingMatch;
const csvRows = [];
csvRows.push("productId\tproductName\tcategory\tbasePrice\tdesignPremium\tsizeVariationPct");

while ((pricingMatch = regexPricing.exec(utilsFile)) !== null) {
  const id = pricingMatch[1];
  const basePrice = pricingMatch[2];
  const divisor = pricingMatch[3];
  const designPremium = pricingMatch[4];
  
  // In utils.ts, the sizeVariationPct is represented by the divisor:
  // (d.length + d.width + d.height) / divisor => sizeVariationPct = 1 / divisor
  // We need to calculate sizeVariationPct
  const sizeVariationPct = (1 / parseInt(divisor, 10)).toFixed(4);
  
  const p = productMap[id] || { name: 'Unknown', category: 'Unknown' };
  
  csvRows.push(`${id}\t${p.name}\t${p.category}\t${basePrice}\t${designPremium}\t${sizeVariationPct}`);
}

fs.writeFileSync('pricing_data.tsv', csvRows.join('\n'));
console.log(`Generated ${csvRows.length - 1} rows.`);
