/** Gmail search + message extraction */
var Services_GmailService = (function () {

  /**
   * Build Gmail search query using label, text query, and date range.
   * Dates: use "after:YYYY/MM/DD before:YYYY/MM/DD" (end is exclusive).
   */
  function buildQuery(p) {
    var after = DateUtils.ymdToSlash(p.dateStart); // YYYY/MM/DD
    // Add one day to end so we can use before: (exclusive)
    var endDate = DateUtils.parseYMD(p.dateEnd);
    var endPlus1 = new Date(endDate.getTime());
    endPlus1.setDate(endPlus1.getDate() + 1);
    var before = DateUtils.ymdToSlash(DateUtils.formatYMD(endPlus1));

    var parts = [];
    if (p.label) parts.push('label:' + p.label);
    if (p.query) parts.push('(' + p.query + ')');
    parts.push('after:' + after, 'before:' + before);
    return parts.join(' ');
  }

  /**
   * Search Gmail and return flattened messages up to maxCount.
   * @return {Array<Object>} messages
   */
  function searchMessages(query, maxCount) {
    var pageSize = 100; // per GmailApp.search page (threads)
    var msgs = [];
    var start = 0;

    while (msgs.length < maxCount) {
      var threads = GmailApp.search(query, start, pageSize);
      if (!threads || threads.length === 0) break;

      for (var t = 0; t < threads.length && msgs.length < maxCount; t++) {
        var thr = threads[t];
        var labels = thr.getLabels().map(function (l) { return l.getName(); });
        var messages = thr.getMessages();

        for (var i = messages.length - 1; i >= 0 && msgs.length < maxCount; i--) {
          // iterate newest-first in the thread
          var m = messages[i];
          var md = extractMessage(m, labels);
          msgs.push(md);
        }
      }
      start += pageSize;
    }
    return msgs;
  }

  function extractMessage(message, threadLabels) {
    var from = String(message.getFrom() || '');
    var parsed = parseFrom(from);
    var dt = message.getDate();
    var dateStr = Utilities.formatDate(dt, AppConfig.DEFAULT_TIMEZONE, 'yyyy-MM-dd HH:mm');

    var msgIdHeader = safeHeader(message, 'Message-ID');
    var messageUrl = msgIdHeader
      ? ('https://mail.google.com/mail/u/0/#search/rfc822msgid:' + encodeURIComponent(msgIdHeader))
      : '';

    return {
      date: dateStr,
      fromName: parsed.name,
      fromEmail: parsed.email,
      subject: String(message.getSubject() || ''),
      snippet: String(message.getPlainBody() || '').substring(0, 200).replace(/\s+/g, ' '),
      labels: threadLabels,
      messageId: msgIdHeader,
      threadId: message.getThread().getId(),
      messageUrl: messageUrl
    };
  }

  function parseFrom(s) {
    // Formats: "Name <email@domain>" or just "email@domain"
    var name = '', email = '';
    var lt = s.indexOf('<'), gt = s.indexOf('>');
    if (lt >= 0 && gt > lt) {
      name = s.substring(0, lt).trim().replace(/^"|"$/g, '');
      email = s.substring(lt + 1, gt).trim();
    } else {
      email = s.trim();
    }
    return { name: name, email: email };
  }

  function safeHeader(message, headerName) {
    try {
      return String(message.getHeader(headerName) || '');
    } catch (e) {
      return '';
    }
  }

  return {
    buildQuery: buildQuery,
    searchMessages: searchMessages
  };
})();
