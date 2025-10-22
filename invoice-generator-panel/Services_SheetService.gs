/** Sheet read/write helpers (v2) */
var Services_SheetService = (function() {

  function readRecord(sh, row, p) {
    function val(colLetter) {
      var col = A1Notation.letterToIndex(colLetter);
      return (sh.getRange(row, col).getValue() || '').toString().trim();
    }
    var itemsRaw = val(p.colItems);
    var items = StringUtils.parseItemsMultiline(itemsRaw); // [{desc,qty,unit,amount},..]

    var invoiceDate = DateUtils.parseDate(val(p.colInvoiceDate), AppConfig.DEFAULT_TIMEZONE) || new Date();
    var dueDate = DateUtils.parseDate(val(p.colDueDate), AppConfig.DEFAULT_TIMEZONE);
    var currency = val(p.colCurrency) || 'IDR';
    var notes = val(p.colNotes);

    var rec = {
      row: row,
      clientName: val(p.colClientName),
      clientEmail: val(p.colClientEmail),
      invoiceDate: invoiceDate,
      dueDate: dueDate,
      currency: currency,
      items: items,
      notes: notes,
      taxRate: Number(p.taxRate || 0),
      discount: Number(p.discount || 0)
    };

    // compute totals with tax/discount
    var totals = StringUtils.computeTotals(items, rec.taxRate, rec.discount);
    rec.subtotal = totals.subtotal;
    rec.tax = totals.tax;
    rec.total = totals.total;
    rec.discountAmount = totals.discount;

    return rec;
  }

  function writeBack(sh, row, p, meta) {
    var docUrl = 'https://docs.google.com/document/d/' + meta.docId + '/edit';
    var pdfUrl = 'https://drive.google.com/file/d/' + meta.pdfId + '/view';

    if (p.colDocLink) sh.getRange(row, A1Notation.letterToIndex(p.colDocLink)).setValue(docUrl);
    if (p.colPdfLink) sh.getRange(row, A1Notation.letterToIndex(p.colPdfLink)).setValue(pdfUrl);
    if (p.colGeneratedDate) sh.getRange(row, A1Notation.letterToIndex(p.colGeneratedDate)).setValue(meta.generatedAt);
    if (p.colStatus) sh.getRange(row, A1Notation.letterToIndex(p.colStatus)).setValue(meta.status);
    if (p.colInvoiceNumber) sh.getRange(row, A1Notation.letterToIndex(p.colInvoiceNumber)).setValue(meta.invoiceNo);
  }

  return {
    readRecord: readRecord,
    writeBack: writeBack
  };
})();

function getSheetOrThrow(name) {
  var ss = SpreadsheetApp.getActive();
  var sh = name ? ss.getSheetByName(name) : ss.getActiveSheet();
  if (!sh) throw new Error('Sheet not found: ' + name);
  return sh;
}
