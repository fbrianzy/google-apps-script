/** Persistent invoice numbering using ScriptProperties */
var Services_NumberingService = (function() {

  function currentYear() {
    return Utilities.formatDate(new Date(), AppConfig.DEFAULT_TIMEZONE, 'yyyy');
  }

  function getState() {
    var year = Properties.getScript('INV_YEAR', currentYear());
    var seq = parseInt(Properties.getScript('INV_SEQ', '0'), 10) || 0;
    return { year: year, seq: seq };
  }

  function saveState(state) {
    Properties.setScript('INV_YEAR', state.year);
    Properties.setScript('INV_SEQ', state.seq);
  }

  function formatNo(state) {
    var seqStr = ('0000' + state.seq).slice(-4);
    return AppConfig.NUMBERING_PREFIX + '-' + state.year + '-' + seqStr;
  }

  function rollYearIfNeeded(state) {
    var y = currentYear();
    if (state.year !== y) {
      state.year = y;
      state.seq = 0;
    }
  }

  /** Peek next number (no increment) */
  function peek() {
    var s = getState();
    rollYearIfNeeded(s);
    var no = formatNo({year:s.year, seq:s.seq + 1});
    return no;
  }

  /** Increment and return number */
  function next() {
    var s = getState();
    rollYearIfNeeded(s);
    s.seq++;
    saveState(s);
    return formatNo(s);
  }

  return { peek: peek, next: next };
})();
