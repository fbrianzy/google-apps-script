/** Generate action: process batch rows and write Doc/PDF links */
var Actions_RunGenerate = (function() {
  function run(p) {
    var started = new Date();
    Actions_RunValidate.run(p);

    var sh = getSheetOrThrow(p.sheetName);
    var updated = 0;
    var errors = [];

    for (var row = p.startRow; row <= p.endRow; row++) {
      try {
        var rec = Services_SheetService.readRecord(sh, row, p);
        if (!rec.clientName) {
          Log.warn('Row skipped, empty client name', { row: row });
          continue;
        }

        var invoiceNo = p.colInvoiceNumber
          ? (sh.getRange(row, A1Notation.letterToIndex(p.colInvoiceNumber)).getValue() || Services_NumberingService.next())
          : Services_NumberingService.next();

        rec.status = p.defaultStatus || AppConfig.DEFAULT_STATUS;

        var docId = Services_DocService.createFromTemplate(p.templateDocId, rec, invoiceNo);
        var pdfId = Services_PdfService.exportToFolder(docId, p.outputFolderId, invoiceNo);

        // Write links & metadata back
        Services_SheetService.writeBack(sh, row, p, {
          docId: docId,
          pdfId: pdfId,
          invoiceNo: invoiceNo,
          status: rec.status,
          generatedAt: new Date()
        });

        // Optional email
        if (p.sendEmail && rec.clientEmail) {
          Services_EmailService.sendInvoice(rec, pdfId, invoiceNo);
        }

        updated++;
        Utilities.sleep(200); // polite pacing
      } catch (e) {
        errors.push('Row ' + row + ': ' + e.message);
        Log.error('Error generate row', { row: row, error: e });
      }
    }

    var durationMs = (new Date()).getTime() - started.getTime();
    return {
      ok: true,
      message: 'Done. Updated ' + updated + ' row(s).',
      updated: updated,
      errors: errors,
      durationMs: durationMs
    };
  }
  return { run: run };
})();
