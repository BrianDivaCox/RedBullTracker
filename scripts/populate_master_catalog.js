/**
 * Populate Master Catalog - Red Bull Tracker 2026
 * Resets Google Sheet to the definitive 70-flavor collection through 2026.
 * Preserves the 22 user-checked flavors.
 */

const DEPLOYMENT_URL = "https://script.google.com/macros/s/AKfycbyYKKMWJyYjwEUFBZmqQs5rdYztIhy1q36V6BeQNRy3-inmylm9YVsdwJg7Bp1z-nmP/exec";

const MASTER_FLAVORS = [
  // --- 1. CORE & SUGARFREE ---
  { name: "Original Red Bull Energy Drink", sf: false, discontinued: false, seasonal: false, checked: true },
  { name: "Red Bull Sugarfree", sf: true, discontinued: false, seasonal: false, checked: true },
  { name: "Red Bull Zero", sf: true, discontinued: false, seasonal: false, checked: false },
  { name: "Red Bull Total Zero (Original 2012 Formula)", sf: true, discontinued: true, seasonal: false, checked: false },

  // --- 2. ACTIVE STANDARD EDITIONS (US & GLOBAL) ---
  { name: "The Amber Edition: Strawberry Apricot", sf: false, discontinued: false, seasonal: false, checked: true },
  { name: "The Blue Edition: Blueberry", sf: false, discontinued: false, seasonal: false, checked: true },
  { name: "The Coconut Edition: Coconut Berry", sf: false, discontinued: false, seasonal: false, checked: true },
  { name: "The Green Edition: Dragon Fruit", sf: false, discontinued: false, seasonal: false, checked: true },
  { name: "The Green Edition: Curuba Elderflower", sf: false, discontinued: false, seasonal: false, checked: true },
  { name: "The Ice Edition: Iced Vanilla Berry", sf: false, discontinued: false, seasonal: false, checked: true },
  { name: "The Peach Edition: White Peach", sf: false, discontinued: false, seasonal: false, checked: true },
  { name: "The Peach Edition: Peach Nectarine", sf: false, discontinued: false, seasonal: false, checked: true },
  { name: "The Pink Edition: Wild Berries", sf: false, discontinued: false, seasonal: false, checked: true },
  { name: "The Red Edition: Watermelon", sf: false, discontinued: false, seasonal: false, checked: true },
  { name: "The Sea Blue Edition: Juneberry", sf: false, discontinued: false, seasonal: false, checked: true },
  { name: "The Yellow Edition: Tropical", sf: false, discontinued: false, seasonal: false, checked: true },

  // --- 3. SEASONAL EDITIONS (2016 - 2026) ---
  { name: "The Spring Edition: Cherry Sakura (2026)", sf: false, discontinued: false, seasonal: true, checked: true },
  { name: "The Summer Edition: Sudachi Lime (2026)", sf: false, discontinued: false, seasonal: true, checked: false },
  { name: "The Winter Edition: Spiced Orchard (2025/2026)", sf: false, discontinued: false, seasonal: true, checked: false },
  { name: "The Spring Edition: Pink Grapefruit (2025)", sf: false, discontinued: false, seasonal: true, checked: false },
  { name: "The Summer Edition: Curuba Elderflower (2024)", sf: false, discontinued: false, seasonal: true, checked: true },
  { name: "The Winter Edition: Iced Vanilla Berry (2024)", sf: false, discontinued: false, seasonal: true, checked: true },
  { name: "The Summer Edition: Juneberry (2023)", sf: false, discontinued: false, seasonal: true, checked: true },
  { name: "The Winter Edition: Pear Cinnamon (2023)", sf: false, discontinued: true, seasonal: true, checked: false },
  { name: "The Summer Edition: Strawberry Apricot (2022)", sf: false, discontinued: false, seasonal: true, checked: true },
  { name: "The Winter Edition: Fig Apple (2022)", sf: false, discontinued: true, seasonal: true, checked: true },
  { name: "The Summer Edition: Dragon Fruit (2021)", sf: false, discontinued: false, seasonal: true, checked: true },
  { name: "The Winter Edition: Pomegranate (2021)", sf: false, discontinued: true, seasonal: true, checked: false },
  { name: "The Summer Edition: Watermelon (2020)", sf: false, discontinued: false, seasonal: true, checked: true },
  { name: "The Winter Edition: Arctic Berry (2020)", sf: false, discontinued: true, seasonal: true, checked: true },
  { name: "The Summer Edition: Beach Breeze (2019)", sf: false, discontinued: true, seasonal: true, checked: false },
  { name: "The Winter Edition: Plum Twist (2018)", sf: false, discontinued: true, seasonal: true, checked: false },
  { name: "The Summer Edition: Coconut Berry (2018)", sf: false, discontinued: false, seasonal: true, checked: true },
  { name: "The Summer Edition: Grapefruit Twist (2017)", sf: false, discontinued: true, seasonal: true, checked: false },
  { name: "The Summer Edition: Kiwi Twist / Kiwi Apple (2016)", sf: false, discontinued: true, seasonal: true, checked: false },

  // --- 4. DISCONTINUED VAULTED CLASSICS ---
  { name: "The Red Edition: Cranberry (Original 2013)", sf: false, discontinued: true, seasonal: false, checked: true },
  { name: "The Silver Edition: Dry Lime (Original 2013)", sf: false, discontinued: true, seasonal: false, checked: false },
  { name: "The Orange Edition: Tangerine (2016)", sf: false, discontinued: true, seasonal: false, checked: false },
  { name: "The Orange Edition: Orange Mango (Total Zero 2015)", sf: true, discontinued: true, seasonal: false, checked: false },
  { name: "The Cherry Edition: Wild Cherry (Total Zero 2015)", sf: true, discontinued: true, seasonal: false, checked: false },
  { name: "The Lime Edition: Limeade (Sugarfree 2016)", sf: true, discontinued: true, seasonal: false, checked: false },
  { name: "The Purple Edition: Acai Berry (2017)", sf: false, discontinued: true, seasonal: false, checked: false },
  { name: "The Pear Edition: Crisp Pear (Sugarfree 2018)", sf: true, discontinued: true, seasonal: false, checked: false },
  { name: "Red Bull Simply Cola (Original 2008 Formula)", sf: false, discontinued: true, seasonal: false, checked: false },
  { name: "Red Bull Energy Shot (2oz)", sf: false, discontinued: true, seasonal: false, checked: true },

  // --- 5. SUGAR FREE EDITION VARIANTS ---
  { name: "The Red Edition Sugarfree: Watermelon Sugarfree", sf: true, discontinued: false, seasonal: false, checked: true },
  { name: "The Amber Edition Sugarfree: Strawberry Apricot Sugarfree", sf: true, discontinued: false, seasonal: false, checked: false },
  { name: "The Sea Blue Edition Sugarfree: Juneberry Sugarfree", sf: true, discontinued: false, seasonal: false, checked: false },
  { name: "The Purple Edition Sugarfree: Acai Berry Sugarfree", sf: true, discontinued: true, seasonal: false, checked: false },
  { name: "The Iced Edition Sugarfree: Iced Vanilla Berry Sugarfree", sf: true, discontinued: false, seasonal: true, checked: false },

  // --- 6. INTERNATIONAL & REGIONAL EXCLUSIVES ---
  { name: "Red Bull Japan Exclusive: Mystic Magic (Kyoho Grape)", sf: false, discontinued: false, seasonal: false, checked: false },
  { name: "Red Bull Japan Exclusive: Ocean Blast (Lychee)", sf: false, discontinued: false, seasonal: true, checked: false },
  { name: "Red Bull Japan Exclusive: Apple Muscat Grape", sf: false, discontinued: false, seasonal: true, checked: false },
  { name: "Red Bull Japan Exclusive: Golden Edition (Passionfruit)", sf: false, discontinued: false, seasonal: true, checked: false },
  { name: "Red Bull Japan Exclusive: Winter Edition Mikan", sf: false, discontinued: false, seasonal: true, checked: false },
  { name: "Red Bull Europe Exclusive: The Lilac Edition (Pink Grapefruit & Blossom)", sf: false, discontinued: false, seasonal: false, checked: false },
  { name: "Red Bull Europe Exclusive: The Green Edition (Kaktusfrucht)", sf: false, discontinued: false, seasonal: false, checked: false },
  { name: "Red Bull Europe Exclusive: The Spring Edition (Woodruff & Pink Grapefruit)", sf: false, discontinued: false, seasonal: true, checked: false },
  { name: "Red Bull UK Exclusive: The Ruby Edition (Apricot-Strawberry)", sf: false, discontinued: false, seasonal: true, checked: false },
  { name: "Red Bull Europe / Asia Exclusive: Red Bull Gold Can (250ml)", sf: false, discontinued: false, seasonal: false, checked: false },
  { name: "Red Bull Energy Drink Supreme (Philippines Bottle)", sf: false, discontinued: false, seasonal: false, checked: true },
  { name: "Krating Daeng Original (Thailand)", sf: false, discontinued: false, seasonal: false, checked: true },
  { name: "Krating Daeng Extra Zinc (Thailand)", sf: false, discontinued: false, seasonal: false, checked: false },
  { name: "Krating Daeng Collagen (Thailand)", sf: false, discontinued: false, seasonal: false, checked: false },

  // --- 7. ORGANICS BY RED BULL ---
  { name: "Organics by Red Bull: Simply Cola", sf: false, discontinued: false, seasonal: false, checked: false },
  { name: "Organics by Red Bull: Bitter Lemon", sf: false, discontinued: false, seasonal: false, checked: false },
  { name: "Organics by Red Bull: Ginger Ale", sf: false, discontinued: false, seasonal: false, checked: false },
  { name: "Organics by Red Bull: Tonic Water", sf: false, discontinued: false, seasonal: false, checked: false },
  { name: "Organics by Red Bull: Viva Mate", sf: false, discontinued: false, seasonal: false, checked: false },
  { name: "Organics by Red Bull: Black Orange", sf: false, discontinued: false, seasonal: false, checked: false },
  { name: "Organics by Red Bull: Purple Berry", sf: false, discontinued: false, seasonal: false, checked: false }
];

async function run() {
  console.log(`🚀 Resetting Google Sheet with ${MASTER_FLAVORS.length} curated master flavors...`);
  console.log(`⭐ Preserving ${MASTER_FLAVORS.filter(f => f.checked).length} checked flavors.`);

  const res = await fetch(DEPLOYMENT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "resetMasterCatalog",
      flavors: MASTER_FLAVORS
    })
  });

  const json = await res.json();
  console.log("✅ Response from Google Apps Script:", json);
}

run().catch(console.error);
