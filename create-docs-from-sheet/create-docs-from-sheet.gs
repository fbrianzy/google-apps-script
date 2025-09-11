/**
 * Fungsi spesial yang berjalan otomatis saat spreadsheet dibuka.
 * Fungsi ini akan membuat menu kustom di UI Spreadsheet.
 */
function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('Doc Generator')
      .addItem('Create Documents from Rows', 'createDocuments')
      .addToUi();
}

/**
 * Membuat file Google Doc untuk setiap baris data di sheet aktif.
 * Mengasumsikan Sheet memiliki kolom: FileName, Header, Body, Status.
 */
function createDocuments() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const ui = SpreadsheetApp.getUi();

  // Dapatkan semua data kecuali baris header (baris pertama)
  const dataRange = sheet.getDataRange();
  const data = dataRange.getValues();
  const headers = data.shift(); // Ambil header dan hapus dari data

  // Cari indeks kolom berdasarkan nama header
  const fileNameIndex = headers.indexOf('FileName');
  const headerIndex = headers.indexOf('Header');
  const bodyIndex = headers.indexOf('Body');
  const statusIndex = headers.indexOf('Status');

  if (fileNameIndex === -1 || headerIndex === -1 || bodyIndex === -1 || statusIndex === -1) {
    ui.alert('Error', 'Pastikan sheet Anda memiliki kolom: FileName, Header, Body, dan Status.', ui.ButtonSet.OK);
    return;
  }

  // Tentukan folder tujuan di Google Drive
  const parentFolder = DriveApp.getFolderById("ID_FOLDER_ANDA_DISINI"); // GANTI DENGAN ID FOLDER ANDA

  data.forEach((row, index) => {
    const status = row[statusIndex];
    // Hanya proses baris yang statusnya belum "Created"
    if (status !== 'Created') {
      const docName = row[fileNameIndex];
      const docHeader = row[headerIndex];
      const docBody = row[bodyIndex];

      // Buat dokumen baru
      const doc = DocumentApp.create(docName);
      const body = doc.getBody();

      // Isi konten dokumen
      body.appendParagraph(docHeader).setHeading(DocumentApp.ParagraphHeading.HEADING1);
      body.appendParagraph(docBody);
      doc.saveAndClose();

      // Pindahkan file ke folder yang ditentukan
      const file = DriveApp.getFileById(doc.getId());
      parentFolder.addFile(file);
      DriveApp.getRootFolder().removeFile(file); // Hapus dari root

      // Update kolom status di sheet
      // index + 2 karena data array dimulai dari 0 dan header sudah dihapus
      sheet.getRange(index + 2, statusIndex + 1).setValue('Created');
    }
  });

  ui.alert('Success', 'Semua dokumen telah berhasil dibuat.', ui.ButtonSet.OK);
}