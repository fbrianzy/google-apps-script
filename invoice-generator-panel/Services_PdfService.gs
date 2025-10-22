/** Export a Doc to PDF into a target folder, return fileId */
var Services_PdfService = (function() {
  function exportToFolder(docId, folderId, invoiceNo) {
    var blob = DriveApp.getFileById(docId).getAs('application/pdf');
    blob.setName(invoiceNo + '.pdf');
    var folder = DriveApp.getFolderById(folderId);
    var pdf = folder.createFile(blob);
    return pdf.getId();
  }
  return { exportToFolder: exportToFolder };
})();
