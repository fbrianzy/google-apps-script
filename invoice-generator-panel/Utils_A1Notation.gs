/** A1 helpers */
var A1Notation = (function() {
  function letterToIndex(letters) {
    letters = String(letters || '').trim().toUpperCase();
    var n = 0;
    for (var i = 0; i < letters.length; i++) {
      n = n * 26 + (letters.charCodeAt(i) - 64);
    }
    return n;
  }
  function indexToLetter(index) {
    var s = '';
    while (index > 0) {
      var mod = (index - 1) % 26;
      s = String.fromCharCode(65 + mod) + s;
      index = Math.floor((index - 1) / 26);
    }
    return s;
  }
  return { letterToIndex: letterToIndex, indexToLetter: indexToLetter };
})();
