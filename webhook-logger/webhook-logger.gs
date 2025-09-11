// Change the ID
const SPREADSHEET_ID = "YOUR_ID_SPREADSHEET_HERE"; 
// Change the SHEET_Name
const SHEET_NAME = "Logs";

/**
 * Menangani permintaan HTTP POST.
 * Semua data yang masuk akan dicatat ke sheet.
 */
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    // Buat baris baru dengan timestamp dan data dari webhook
    const newRow = [];
    newRow.push(new Date()); // Kolom A: Timestamp

    // Cek tipe konten dari request
    if (e.postData.type === "application/json") {
      const jsonData = JSON.parse(e.postData.contents);
      // Ubah JSON menjadi string agar mudah disimpan dalam satu sel
      newRow.push(JSON.stringify(jsonData)); // Kolom B: JSON Payload
    } else {
      // Jika bukan JSON, simpan sebagai teks biasa
      newRow.push(e.postData.contents); // Kolom B: Text Payload
    }

    sheet.appendRow(newRow);

    // Kirim respons sukses kembali ke pengirim webhook
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "success", "message": "Data logged successfully." }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Kirim respons error jika terjadi masalah
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
