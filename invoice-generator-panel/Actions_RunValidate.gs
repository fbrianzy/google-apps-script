/** Validate panel payload & basic ranges (v2 fields included) */
var Actions_RunValidate = (function() {
  function run(p) {
    // Required fields
    var req = ['templateDocId', 'outputFolderId', 'sheetName',
               'startRow', 'endRow', 'colClientName', 'colClientEmail',
               'colInvoiceDate', 'colDueDate', 'colCurrency',
               'colItems', 'colNotes',
               'colDocLink', 'colPdfLink'];
    req.forEach(function(k) {
      if (!p[k]) throw new Error('Missing field: ' + k);
    });

    if (p.startRow < 2 || p.endRow < p.startRow) {
      throw new Error('Invalid rows: startRow must be >= 2 and endRow >= startRow.');
    }

    // Validate IDs
    DriveApp.getFolderById(p.outputFolderId); // throws if not found
    DriveApp.getFileById(p.templateDocId);    // throws if not found

    // Validate columns (letters only)
    var cols = ['colClientName','colClientEmail','colInvoiceDate','colDueDate','colCurrency','colItems','colNotes','colDocLink','colPdfLink'];
    if (p.colGeneratedDate) cols.push('colGeneratedDate');
    if (p.colStatus) cols.push('colStatus');
    if (p.colInvoiceNumber) cols.push('colInvoiceNumber');
    cols.forEach(function(c) {
      if (!/^[A-Z]+$/.test(p[c])) {
        throw new Error('Invalid column letter for ' + c + ': ' + p[c]);
      }
    });

    // Numeric checks
    if (p.taxRate != null && isNaN(Number(p.taxRate))) {
      throw new Error('Tax Rate must be a number.');
    }
    if (p.discount != null && isNaN(Number(p.discount))) {
      throw new Error('Discount must be a number.');
    }

    // Email option
    if (p.sendEmail && !p.colClientEmail) {
      throw new Error('Client Email column mapping is required when Send Email is enabled.');
    }

    return { ok: true, message: 'Validation OK' };
  }
  return { run: run };
})();
