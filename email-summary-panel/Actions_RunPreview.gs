/** Preview first N (default 5) results without writing to sheet */
var Actions_RunPreview = (function () {
  function run(p) {
    Actions_RunValidate.run(p);
    var query = Services_GmailService.buildQuery(p);
    var lim = Math.min(Number(p.previewCount || 5), 20);
    var items = Services_GmailService.searchMessages(query, Number(p.maxEmails)).slice(0, lim);
    return {
      ok: true,
      message: 'Preview ' + items.length + ' messages.',
      sample: items.map(function (x) {
        return {
          date: x.date,
          fromName: x.fromName,
          subject: x.subject,
          snippet: x.snippet
        };
      })
    };
  }
  return { run: run };
})();
