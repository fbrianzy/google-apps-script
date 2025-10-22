/** Date parse/format helpers */
var DateUtils = (function() {
  function parseDate(input, tz) {
    if (!input) return null;
    if (Object.prototype.toString.call(input) === '[object Date]') return input;
    var s = String(input).trim();
    // Try parse yyyy-mm-dd
    var m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
      return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    }
    // Fallback: let Spreadsheet parse
    try {
      return new Date(s);
    } catch (e) {
      return null;
    }
  }
  return { parseDate: parseDate };
})();
