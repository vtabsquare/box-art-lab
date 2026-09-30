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

// Client-side SHA-256 password hashing helper
export async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function registerUser(
  data: VisitorData,
  passwordHash: string
): Promise<{ success: boolean; error?: string }> {
  if (!GOOGLE_SCRIPT_URL) {
    console.warn('[GoogleSheets] No script URL configured — running in demo mode.');
    return { success: true };
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' // Prevents CORS preflight precheck block in Apps Script
      },
      body: JSON.stringify({
        action: 'register',
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        location: data.location,
        passwordHash
      }),
    });

    const result = await response.json();
    if (result.status === 'success') {
      return { success: true };
    } else {
      return { success: false, error: result.message || 'Registration failed' };
    }
  } catch (error: any) {
    console.error('[GoogleSheets] Error registering user:', error);
    return { success: false, error: error.message };
  }
}

export async function loginUser(
  email: string,
  passwordHash: string
): Promise<{ success: boolean; user?: VisitorData; error?: string }> {
  if (!GOOGLE_SCRIPT_URL) {
    console.warn('[GoogleSheets] No script URL configured — running in demo mode.');
    // In demo mode, simulate success if email ends with @example.com or is filled
    return {
      success: true,
      user: {
        name: 'Demo User',
        email: email,
        mobile: '1234567890',
        location: 'Demo Land'
      }
    };
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'login',
        email,
        passwordHash
      }),
    });

    const result = await response.json();
    if (result.status === 'success') {
      return { success: true, user: result.user };
    } else {
      return { success: false, error: result.message || 'Login failed' };
    }
  } catch (error: any) {
    console.error('[GoogleSheets] Error logging in:', error);
    return { success: false, error: error.message };
  }
}

export async function changePasswordInSheet(
  email: string,
  passwordHash: string
): Promise<{ success: boolean; error?: string }> {
  if (!GOOGLE_SCRIPT_URL) {
    console.warn('[GoogleSheets] No script URL configured — running in demo mode.');
    return { success: true };
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'changePassword',
        email,
        passwordHash
      }),
    });

    const result = await response.json();
    if (result.status === 'success') {
      return { success: true };
    } else {
      return { success: false, error: result.message || 'Password update failed' };
    }
  } catch (error: any) {
    console.error('[GoogleSheets] Error updating password:', error);
    return { success: false, error: error.message };
  }
}

// Deprecated fallback to keep other files compiling
export async function storeVisitorData(
  data: VisitorData
): Promise<{ success: boolean; error?: string }> {
  return registerUser(data, '');
}

