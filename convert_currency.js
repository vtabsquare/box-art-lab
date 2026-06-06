import fs from 'fs';

const utilsFile = fs.readFileSync('src/lib/utils.ts', 'utf-8');
const designRulesFile = fs.readFileSync('src/lib/designRules.ts', 'utf-8');

const multiplier = 80;

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

let newUtilsContent = utilsFile;

// Parse utils.ts to get pricing
const regexPricing = /('([^']+)': \{ basePrice: )([\d.]+)(, sizeVariationPct: )([\d.]+)(, designPremium: )([\d.]+)( \},)/g;
let pricingMatch;
const csvRows = [];
csvRows.push("productId\tproductName\tcategory\tbasePrice\tdesignPremium\tsizeVariationPct");

newUtilsContent = newUtilsContent.replace(regexPricing, (fullMatch, p1, id, basePrice, p4, sizeVar, p6, designPremium, p8) => {
  const newBasePrice = (parseFloat(basePrice) * multiplier).toFixed(0);
  const newDesignPremium = (parseFloat(designPremium) * multiplier).toFixed(0);
  
  const p = productMap[id] || { name: 'Unknown', category: 'Unknown' };
  csvRows.push(`${id}\t${p.name}\t${p.category}\t${newBasePrice}\t${newDesignPremium}\t${parseFloat(sizeVar).toFixed(4)}`);
  
  return `${p1}${newBasePrice}${p4}${parseFloat(sizeVar).toFixed(4)}${p6}${newDesignPremium}${p8}`;
});

fs.writeFileSync('src/lib/utils.ts', newUtilsContent);
fs.writeFileSync('pricing_data_inr.tsv', csvRows.join('\n'));
console.log(`Generated ${csvRows.length - 1} rows in INR.`);
