/**
 * Mengambil kurs mata uang terkini dari satu mata uang ke mata uang lainnya.
 * @param {string} from Mata uang asal (contoh: "USD").
 * @param {string} to Mata uang tujuan (contoh: "IDR").
 * @param {number} amount Jumlah uang yang akan dikonversi (opsional, default 1).
 * @return Nilai yang sudah dikonversi.
 * @customfunction
 */
function GET_CURRENCY_RATE(from, to, amount) {
  if (!from || !to) {
    return "ERROR: 'from' and 'to' currency codes are required.";
  }

  const fromCurrency = from.toString().toUpperCase().trim();
  const toCurrency = to.toString().toUpperCase().trim();
  const amountToConvert = amount || 1;

  if (fromCurrency === toCurrency) {
    return amountToConvert;
  }

  // Menggunakan Cache Service untuk efisiensi
  const cache = CacheService.getScriptCache();
  const cacheKey = `currency_${fromCurrency}_${toCurrency}`;
  const cachedRate = cache.get(cacheKey);

  if (cachedRate) {
    return parseFloat(cachedRate) * amountToConvert;
  }

  try {
    // Menggunakan API gratis dari Frankfurter.app
    const url = `https://api.frankfurter.app/latest?from=${fromCurrency}&to=${toCurrency}`;
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });

    if (response.getResponseCode() !== 200) {
      return `ERROR: API request failed with status ${response.getResponseCode()}.`;
    }

    const data = JSON.parse(response.getContentText());
    const rate = data.rates[toCurrency];

    if (!rate) {
      return `ERROR: Rate for '${toCurrency}' not found.`;
    }
    
    // Simpan di cache selama 4 jam (14400 detik)
    cache.put(cacheKey, rate.toString(), 14400);

    return rate * amountToConvert;

  } catch (e) {
    return `ERROR: ${e.message}`;
  }
}