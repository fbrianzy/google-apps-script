/** Fetch messages and write to sheet */
var Actions_RunFetch = (function () {
  function run(p) {
    var started = new Date();
    Actions_RunValidate.run(p);

    var sh = Services_SheetService.getOrCreateSheet(p.sheetName);
    var query = Services_GmailService.buildQuery(p);

    var msgs = Services_GmailService.searchMessages(query, Number(p.maxEmails));

    // Write
    if (p.writeMode === 'CLEAR_WRITE') {
      Services_SheetService.clearAndWriteHeader(sh, AppConfig.OUTPUT_HEADERS);
      Services_SheetService.writeRows(sh, 2, msgs.map(toRow));
    } else {
      // append
      var last = sh.getLastRow();
      if (last < 1) {
        Services_SheetService.clearAndWriteHeader(sh, AppConfig.OUTPUT_HEADERS);
        Services_SheetService.writeRows(sh, 2, msgs.map(toRow));
      } else {
        Services_SheetService.writeRows(sh, last + 1, msgs.map(toRow));
      }
    }

    var durationMs = new Date().getTime() - started.getTime();
    return {
      ok: true,
      message: 'Wrote ' + msgs.length + ' rows to "' + p.sheetName + '".',
      count: msgs.length,
      durationMs: durationMs,
      query: query
    };
  }

  function toRow(m) {
    return [
      m.date,
      m.fromName,
      m.fromEmail,
      m.subject,
      m.snippet,
      (m.labels || []).join(', '),
      m.messageId,
      m.threadId,
      m.messageUrl
    ];
  }

  return { run: run };
})();
