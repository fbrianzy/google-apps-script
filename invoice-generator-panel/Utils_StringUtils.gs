/** String & money helpers (v2 with tax/discount) */
var StringUtils = (function() {

  /** Parse multiline items to array of {desc, qty, unit, amount}
   * Each line: Description | Qty | UnitPrice
   * Example cell:
   *   Design work | 2 | 150000
   *   Hosting     | 1 | 50000
   */
  function parseItemsMultiline(text) {
    var lines = String(text || '').split(/?
/).map(function(s){ return s.trim(); }).filter(Boolean);
    var items = [];
    lines.forEach(function(line){
      var parts = line.split('|').map(function(s){ return s.trim(); });
      if (parts.length >= 3) {
        var desc = parts[0];
        var qty = parseFloat(parts[1]) || 0;
        var unit = parseFloat(parts[2]) || 0;
        var amount = qty * unit;
        items.push({ desc: desc, qty: qty, unit: unit, amount: amount });
      }
    });
    return items;
  }

  function computeTotals(items, taxRatePercent, discountPercent) {
    var subtotal = 0;
    items.forEach(function(it){ subtotal += (it.amount || 0); });

    var tax = subtotal * (Number(taxRatePercent || 0) / 100);
    var discount = subtotal * (Number(discountPercent || 0) / 100);
    var total = subtotal + tax - discount;

    return { subtotal: subtotal, tax: tax, discount: discount, total: total };
  }

  function formatMoney(n, currency) {
    n = Number(n) || 0;
    var locale = 'id-ID';
    try {
      return Utilities.formatString('%s %s', currency || 'IDR', n.toLocaleString(locale));
    } catch (e) {
      return (currency || 'IDR') + ' ' + n.toFixed(2);
    }
  }

  return {
    parseItemsMultiline: parseItemsMultiline,
    computeTotals: computeTotals,
    formatMoney: formatMoney
  };
})();
