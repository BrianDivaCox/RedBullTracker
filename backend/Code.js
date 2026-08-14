/**
 * Red Bull Master Tracker - Backend Web API
 * Project: RedBullTracker
 * Spreadsheet: 1Ey-jAHm0tR8ejP9fCSjQ0PAWtcfGTpMCWkFGdjSoi8c
 */

const TARGET_SPREADSHEET_ID = "1Ey-jAHm0tR8ejP9fCSjQ0PAWtcfGTpMCWkFGdjSoi8c";

function doGet(e) {
  try {
    let ss;
    try {
      ss = SpreadsheetApp.openById(TARGET_SPREADSHEET_ID);
    } catch(err) {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }
    
    if (!ss) {
      throw new Error("Could not access target spreadsheet.");
    }
    
    const allSheets = ss.getSheets();
    let sheet = null;
    
    for (let i = 0; i < allSheets.length; i++) {
      if (allSheets[i].getSheetId() === 30390711 || allSheets[i].getName().toLowerCase().includes("red bull") || allSheets[i].getName().toLowerCase().includes("flavor")) {
        sheet = allSheets[i];
        break;
      }
    }
    if (!sheet && allSheets.length > 0) {
      sheet = allSheets[0];
    }
    
    const data = sheet.getDataRange().getValues();
    if (!data || data.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "ok", 
        sheetName: sheet.getName(),
        total: 0,
        flavors: [] 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Find the header row (the first row containing keywords like flavor, name, had, tried, status, etc.)
    let headerRowIndex = 0;
    for (let r = 0; r < Math.min(10, data.length); r++) {
      const rowStr = data[r].map(c => String(c).toLowerCase()).join(" ");
      if (rowStr.includes("flavor") || rowStr.includes("name") || rowStr.includes("had") || rowStr.includes("tried") || rowStr.includes("edition") || rowStr.includes("status") || rowStr.includes("sugar")) {
        headerRowIndex = r;
        break;
      }
    }

    const headers = data[headerRowIndex].map(h => String(h).trim().toLowerCase());
    
    // Find column indexes
    let nameIdx = headers.findIndex(h => h.includes("name") || h.includes("flavor") || h.includes("title") || h.includes("variant") || h.includes("edition"));
    let checkIdx = headers.findIndex(h => h.includes("check") || h.includes("had") || h.includes("tried") || h.includes("tasted") || h.includes("status") || h.includes("done") || h.includes("drink"));
    let sfIdx = headers.findIndex(h => h.includes("sugar") || h.includes("sf") || h.includes("zero"));
    let discIdx = headers.findIndex(h => h.includes("discontinued") || h.includes("vault") || h.includes("retired") || h.includes("active"));
    let seasonIdx = headers.findIndex(h => h.includes("season") || h.includes("limited"));
    let countryIdx = headers.findIndex(h => h.includes("country") || h.includes("region") || h.includes("intl") || h.includes("exclusive") || h.includes("japan"));

    // Fallback column heuristics if header matching is ambiguous
    if (nameIdx === -1) {
      // Find the first column with non-empty strings longer than 3 chars in row headerRowIndex + 1
      for (let c = 0; c < (data[headerRowIndex + 1] || []).length; c++) {
        if (typeof data[headerRowIndex + 1][c] === "string" && data[headerRowIndex + 1][c].length > 3) {
          nameIdx = c;
          break;
        }
      }
      if (nameIdx === -1) nameIdx = 0;
    }

    if (checkIdx === -1) {
      // Look for boolean or short checkbox column
      for (let c = 0; c < (data[headerRowIndex + 1] || []).length; c++) {
        const sample = data[headerRowIndex + 1][c];
        if (typeof sample === "boolean" || sample === "TRUE" || sample === "FALSE" || sample === 1 || sample === 0) {
          checkIdx = c;
          break;
        }
      }
    }

    const flavors = [];
    let idCounter = 1;

    for (let i = headerRowIndex + 1; i < data.length; i++) {
      const row = data[i];
      const flavorName = String(row[nameIdx] || "").trim();
      if (!flavorName || flavorName.toLowerCase() === "total" || flavorName.toLowerCase() === "summary" || flavorName.toLowerCase().startsWith("total ")) continue;

      let isChecked = false;
      if (checkIdx !== -1) {
        const val = row[checkIdx];
        isChecked = (val === true || String(val).toLowerCase() === "true" || String(val).toLowerCase() === "yes" || val === 1 || String(val).trim() === "x" || String(val).trim() === "✓");
      }

      let isSf = false;
      if (sfIdx !== -1) {
        const val = row[sfIdx];
        isSf = (val === true || String(val).toLowerCase() === "true" || String(val).toLowerCase() === "yes");
      } else {
        isSf = flavorName.toLowerCase().includes("sugar free") || flavorName.toLowerCase().includes("sugarfree") || flavorName.toLowerCase().includes("zero");
      }

      let isDisc = false;
      if (discIdx !== -1) {
        const val = String(row[discIdx]).toLowerCase().trim();
        if (headers[discIdx] && headers[discIdx].includes("active")) {
          isDisc = (val === "false" || val === "no" || val === "discontinued" || val === "retired");
        } else {
          isDisc = (val === "true" || val === "yes" || val === "discontinued" || val === "retired");
        }
      }

      let isSeason = false;
      if (seasonIdx !== -1) {
        const val = row[seasonIdx];
        isSeason = (val === true || String(val).toLowerCase() === "true" || String(val).toLowerCase() === "yes");
      } else {
        isSeason = flavorName.toLowerCase().includes("edition") || flavorName.toLowerCase().includes("spring") || flavorName.toLowerCase().includes("summer") || flavorName.toLowerCase().includes("winter");
      }

      const country = countryIdx !== -1 ? String(row[countryIdx] || "").trim() : "";

      flavors.push({
        id: idCounter++,
        name: flavorName,
        checked: isChecked,
        sf: isSf,
        discontinued: isDisc,
        seasonal: isSeason,
        country: country
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "ok",
      sheetName: sheet.getName(),
      headerRowIndex: headerRowIndex,
      headers: headers,
      nameIdx: nameIdx,
      checkIdx: checkIdx,
      sampleRawRows: data.slice(0, 5),
      total: flavors.length,
      hadCount: flavors.filter(f => f.checked).length,
      remainingCount: flavors.filter(f => !f.checked).length,
      flavors: flavors
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
