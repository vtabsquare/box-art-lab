// Google Sheets integration via Google Apps Script Web App
// 1. Create a Google Sheet with two tabs: "Leads" and "Pricing"
// 2. In "Pricing", create columns:
//    productId | productName | category | basePrice | designPremium | sizeVariationPct | maxDimension
//    - maxDimension (optional): sets the max slider limit (in cm) for that product in the UI.
//      e.g. 100 means sliders go up to 100 cm. Leave blank for default (50 cm).
// 3. Deploy this Google Apps Script as a Web App:
//
// ---
// const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
//
// function doPost(e) {
//   const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Leads');
//   const data = JSON.parse(e.postData.contents);
//   sheet.appendRow([
//     data.timestamp,
//     data.name,
//     data.email,
//     data.mobile,
//     data.location
//   ]);
//   return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
//     .setMimeType(ContentService.MimeType.JSON);
// }
//
// function doGet(e) {
//   if (e.parameter.action === 'getPricing') {
//     const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Pricing');
//     const data = sheet.getDataRange().getValues();
//     const headers = data[0];
//     const rows = data.slice(1).filter(r => r[0]); // skip empty rows
//     
//     const result = rows.map(row => {
//       let obj = {};
//       headers.forEach((header, index) => {
//         obj[header] = row[index];
//       });
//       return obj;
//     });
//     
//     // Need CORS headers for doGet fetches from browser
//     const output = ContentService.createTextOutput(JSON.stringify(result))
//       .setMimeType(ContentService.MimeType.JSON);
//     return output;
//   }
//   return ContentService.createTextOutput(JSON.stringify({ error: 'invalid action' }));
// }
// ---


const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

export interface VisitorData {
  name: string;
  email: string;
  mobile: string;
  location: string;
}

export async function storeVisitorData(
  data: VisitorData
): Promise<{ success: boolean; error?: string }> {
  if (!GOOGLE_SCRIPT_URL) {
    console.warn(
      '[GoogleSheets] No script URL configured — data logged to console:',
      data
    );
    // Demo mode: just log
    return { success: true };
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Apps Script web apps require no-cors
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
      }),
    });

    // no-cors responses are opaque, so we assume success
    return { success: true };
  } catch (error: any) {
    console.error('[GoogleSheets] Error storing data:', error);
    return { success: false, error: error.message };
  }
}
