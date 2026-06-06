/**
 * Pricing Service — fetches live base prices from Google Sheets.
 *
 * The Google Apps Script's doGet() returns a JSON array of pricing rows.
 * If the env variable is missing or the fetch fails, falls back to the
 * hardcoded prices already in utils.ts.
 *
 * Expected JSON shape returned by Apps Script:
 * [
 *   {
 *     "productId": "pizza-box",
 *     "productName": "Pizza Box",
 *     "category": "food",
 *     "basePrice": 0.5,
 *     "designPremium": 0.25,
 *     "sizeVariationPct": 0.05,
 *     "maxDimension": 100 // optional, max limit for sliders
 *   },
 *   ...
 * ]
 */

const PRICING_SCRIPT_URL = import.meta.env.VITE_PRICING_SCRIPT_URL || import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

export interface LivePricingRow {
  productId: string;
  productName: string;
  category: string;
  basePrice: number;
  designPremium: number;
  sizeVariationPct: number; // % price increase per 1 cm of total (L+W+H)
  maxDimension?: number;
}

export type LivePricingMap = Record<string, LivePricingRow>;

let _cache: LivePricingMap | null = null;
let _lastFetch = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch the live pricing table from Google Sheets.
 * Results are cached for 5 minutes to avoid hammering the Apps Script.
 */
export async function fetchLivePricing(): Promise<LivePricingMap> {
  const now = Date.now();

  // Return from cache if still fresh
  if (_cache && now - _lastFetch < CACHE_TTL_MS) {
    return _cache;
  }

  if (!PRICING_SCRIPT_URL) {
    console.info('[Pricing] No VITE_PRICING_SCRIPT_URL set — using hardcoded fallback prices.');
    return {};
  }

  try {
    const url = `${PRICING_SCRIPT_URL}?action=getPricing`;
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const rows: LivePricingRow[] = await response.json();
    const map: LivePricingMap = {};

    rows.forEach((row) => {
      map[row.productId] = {
        productId: row.productId,
        productName: row.productName,
        category: row.category,
        basePrice: Number(row.basePrice),
        designPremium: Number(row.designPremium),
        sizeVariationPct: Number(row.sizeVariationPct),
        maxDimension: row.maxDimension ? Number(row.maxDimension) : undefined,
      };
    });

    _cache = map;
    _lastFetch = now;
    console.info(`[Pricing] Loaded ${rows.length} product prices from Google Sheets.`);
    return map;
  } catch (err) {
    console.warn('[Pricing] Failed to fetch live pricing, using fallback:', err);
    return _cache || {}; // Return stale cache if available
  }
}

/** Force-clear the in-memory cache (useful after admin edits) */
export function invalidatePricingCache() {
  _cache = null;
  _lastFetch = 0;
}
