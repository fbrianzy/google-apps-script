/** Date helpers (YYYY-MM-DD parsing/formatting) */
var DateUtils = (function () {

  function parseYMD(s) {
    if (!s) return null;
    var m = String(s).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    var y = Number(m[1]), mo = Number(m[2]) - 1, d = Number(m[3]);
    return new Date(y, mo, d, 0, 0, 0, 0);
  }

  function formatYMD(d) {
    var y = d.getFullYear();
    var m = ('0' + (d.getMonth() + 1)).slice(-2);
    var day = ('0' + d.getDate()).slice(-2);
    return y + '-' + m + '-' + day;
  }

  function ymdToSlash(ymd) {
    var dt = (ymd instanceof Date) ? ymd : parseYMD(String(ymd));
    if (!dt) return '';
    var y = dt.getFullYear();
    var m = ('0' + (dt.getMonth() + 1)).slice(-2);
    var d = ('0' + dt.getDate()).slice(-2);
    return y + '/' + m + '/' + d;
  }

  return {
    parseYMD: parseYMD,
    formatYMD: formatYMD,
    ymdToSlash: ymdToSlash
  };
})();
