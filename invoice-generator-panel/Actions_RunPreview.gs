/** Preview action: generate ONE invoice (Doc only, not writing back links) */
var Actions_RunPreview = (function() {
  function run(p) {
    Actions_RunValidate.run(p);

    var sh = getSheetOrThrow(p.sheetName);
    var row = p.startRow; // preview the first selected row
    var rec = Services_SheetService.readRecord(sh, row, p);

    // Determine invoice number (no persist on preview)
    var invoiceNo = p.colInvoiceNumber
      ? (sh.getRange(row, A1Notation.letterToIndex(p.colInvoiceNumber)).getValue() || Services_NumberingService.peek())
      : Services_NumberingService.peek();

    // Status from panel (default Draft)
    rec.status = p.defaultStatus || AppConfig.DEFAULT_STATUS;

    var docId = Services_DocService.createFromTemplate(p.templateDocId, rec, invoiceNo);

    return {
      ok: true,
      message: 'Preview generated for row ' + row,
      docId: docId,
      docUrl: 'https://docs.google.com/document/d/' + docId + '/edit'
    };
  }
  return { run: run };
})();
