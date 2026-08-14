/**
 * Red Bull Flavor Radar - Automated Discovery Bot
 * Crawls product registry feeds and adds verified uncataloged flavors to your Google Sheet.
 */

const API_ENDPOINT = "https://script.google.com/macros/s/AKfycby3SoNI4chZ5TH_5ff5fxsw8kGLPoZtb5yqUx65MNFkmQ47mgBXzuPdp27lzL8t9Jz7/exec";

// Public global registries and flavor feeds (OpenFoodFacts API v2)
const REGISTRY_SOURCES = [
  "https://world.openfoodfacts.org/cgi/search.pl?search_terms=Red+Bull+Edition&search_simple=1&action=process&json=1&page_size=100",
  "https://world.openfoodfacts.org/cgi/search.pl?search_terms=Red+Bull+Sugarfree&search_simple=1&action=process&json=1&page_size=100"
];

function cleanTitle(raw) {
  if (!raw) return "";
  let name = String(raw).trim();
  // Remove volume/sizes: 250ml, 355ml, 12 fl oz, 8.4oz, 473ml, etc.
  name = name.replace(/\b\d+(\.\d+)?\s*(ml|oz|fl\s*oz|cl|l|liter|liters|g)\b/gi, '');
  // Remove pricing, barcodes or pack tags: e.g. "£1.95", "6x4", "4 pack", "case"
  name = name.replace(/[$£€]\s*\d+(\.\d+)?/g, '');
  name = name.replace(/\b\d+\s*x\s*\d+\b/gi, '');
  name = name.replace(/\b\d+\s*pack\b/gi, '');
  // Strip trailing dashes and punctuation
  name = name.replace(/[-–—_]+$/, '').trim();
  name = name.replace(/\s+/g, ' ');
  return name;
}

function isLegitimateFlavor(name) {
  if (!name || name.length < 8) return false;
  const lower = name.toLowerCase();
  
  if (!lower.includes("red bull") && !lower.includes("krating daeng")) return false;

  // Filter out noise, multipacks, merchandise, accessories
  const blacklist = [
    "multipack", "pack of", "case of", "canister", "dispenser", "merch",
    "cooler", "fridge", "hat", "cap", "shirt", "tray", "pallet",
    "barcode", "sample", "unknown"
  ];
  if (blacklist.some(b => lower.includes(b))) return false;

  // Must have a distinguishing flavor keyword or edition indicator
  const flavorSignals = [
    "edition", "flavor", "flavour", "zero", "sugarfree", "sugar free", 
    "berry", "lime", "peach", "apricot", "apple", "grape", "watermelon", 
    "tropical", "coconut", "vanilla", "plum", "pear", "curuba", "sakura",
    "pomegranate", "cola", "orange", "citrus", "shot", "supreme", "extra", "gold"
  ];

  return flavorSignals.some(sig => lower.includes(sig));
}

async function runFlavorRadar() {
  console.log("📡 [Flavor Radar Bot] Starting daily discovery scan...");

  // 1. Fetch current catalog from Google Sheet
  let currentCatalog = [];
  try {
    const res = await fetch(API_ENDPOINT);
    const json = await res.json();
    if (json.status === "ok" && Array.isArray(json.flavors)) {
      currentCatalog = json.flavors.map(f => f.name.toLowerCase().trim());
      console.log(`✅ Loaded ${currentCatalog.length} existing catalog entries from Google Sheet.`);
    }
  } catch (err) {
    console.error("❌ Failed to fetch current catalog:", err.message);
    process.exit(1);
  }

  // 2. Query Public Databases
  const candidateFlavors = new Map();

  for (const sourceUrl of REGISTRY_SOURCES) {
    try {
      console.log(`🔍 Querying registry source...`);
      const response = await fetch(sourceUrl, {
        headers: { 'User-Agent': 'RedBullTracker-DiscoveryBot/1.0 (contact@briandivacox.com)' }
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch(e) {
        continue;
      }
      
      if (data && Array.isArray(data.products)) {
        for (const prod of data.products) {
          const rawName = prod.product_name || prod.product_name_en;
          const cleaned = cleanTitle(rawName);
          
          if (isLegitimateFlavor(cleaned)) {
            const key = cleaned.toLowerCase();
            if (!candidateFlavors.has(key)) {
              const isSf = key.includes("sugar") || key.includes("zero") || key.includes("sans sucre");
              const isSeasonal = key.includes("edition") || key.includes("summer") || key.includes("winter") || key.includes("spring");
              candidateFlavors.set(key, {
                name: cleaned,
                sf: isSf,
                discontinued: false,
                seasonal: isSeasonal,
                country: prod.countries || ""
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn(`⚠️ Registry query warning: ${e.message}`);
    }
  }

  console.log(`🔍 Total unique Red Bull candidate flavors verified: ${candidateFlavors.size}`);

  // 3. Compare with existing catalog
  const newDiscoveries = [];
  for (const [key, flavorObj] of candidateFlavors.entries()) {
    const isAlreadyCataloged = currentCatalog.some(existing => {
      const eClean = existing.replace(/[^a-z0-9]/g, '');
      const kClean = key.replace(/[^a-z0-9]/g, '');
      return eClean.includes(kClean) || kClean.includes(eClean);
    });

    if (!isAlreadyCataloged) {
      newDiscoveries.push(flavorObj);
    }
  }

  console.log(`✨ New flavors discovered: ${newDiscoveries.length}`);

  if (newDiscoveries.length === 0) {
    console.log("🎉 All scanned flavors are already cataloged in your Google Sheet. No new additions needed.");
    return;
  }

  // 4. Send discovered flavors to Google Apps Script backend
  console.log(`📤 Sending ${newDiscoveries.length} verified new flavors to Google Sheet...`);
  try {
    const postRes = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "batchAdd",
        flavors: newDiscoveries
      })
    });
    const postJson = await postRes.json();
    console.log("✅ Google Sheet Response:", postJson);
    console.log(`🏆 Successfully added ${postJson.addedCount || newDiscoveries.length} new flavors to your tracker!`);
  } catch (err) {
    console.error("❌ Failed to push new discoveries to Google Sheet:", err.message);
  }
}

runFlavorRadar();
