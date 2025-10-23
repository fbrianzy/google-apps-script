/** Sheet helpers: create, clear, write rows */
var Services_SheetService = (function () {

  function getOrCreateSheet(name) {
    var ss = SpreadsheetApp.getActive();
    var sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    return sh;
  }

  function clearAndWriteHeader(sh, headers) {
    sh.clear({ contentsOnly: true });
    if (headers && headers.length) {
      sh.getRange(1, 1, 1, headers.length).setValues([headers]);
      sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sh.setFrozenRows(1);
    }
  }

  function writeRows(sh, startRow, rows) {
    if (!rows || !rows.length) return;
    var cols = rows[0].length;
    sh.getRange(startRow, 1, rows.length, cols).setValues(rows);
    sh.autoResizeColumns(1, cols);
  }

  return {
    getOrCreateSheet: getOrCreateSheet,
    clearAndWriteHeader: clearAndWriteHeader,
    writeRows: writeRows
  };
})();
