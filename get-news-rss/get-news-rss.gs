/*********************************************************
 * Custom function per kategori & lokasi
 * Pakai di sel: =GET_NEWS(D9, E2)
 * - Filter otomatis: 1–31 Agustus 2025
 * - Output: link asli (publisher) dipisah koma atau "tidak ada"
 *********************************************************/
function GET_NEWS(kategori, lokasi) {
  kategori = (kategori || '').toString().trim();
  lokasi   = (lokasi   || '').toString().trim();
  if (!kategori) return '';

  const START_DATE = '2025-08-01';
  const END_DATE_EXCL = '2025-09-01';
  const MAX_PER_CATEGORY = 2;
  const hl = 'id', gl = 'ID', ceid = 'ID:id';

  // fallback lokasi opsional
  const LOCATION = lokasi || 'Sidoarjo';

  try {
    const query = `"${kategori}" "${LOCATION}" after:${START_DATE} before:${END_DATE_EXCL}`;
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${ceid}`;

    // Cache sederhana (30 menit) – unik per kategori+lokasi+range
    const cache = CacheService.getScriptCache();
    const cacheKey = 'rss:' + Utilities.base64Encode([url, MAX_PER_CATEGORY].join('|'));
    const cached = cache.get(cacheKey);
    if (cached) {
      try {
        const arr = JSON.parse(cached);
        return arr.length ? arr.join(', ') : 'tidak ada';
      } catch (_) {}
    }

    const resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (resp.getResponseCode() !== 200) {
      return `ERROR HTTP ${resp.getResponseCode()}`;
    }

    const xml = resp.getContentText('UTF-8');
    const doc = XmlService.parse(xml);
    const channel = doc.getRootElement().getChild('channel');
    if (!channel) return 'tidak ada';

    const items = channel.getChildren('item') || [];
    const outLinks = [];
    const seen = new Set();

    for (let i = 0; i < items.length && outLinks.length < MAX_PER_CATEGORY; i++) {
      const item = items[i];
      const linkEl = item.getChild('link');
      if (!linkEl) continue;

      const rssLink = (linkEl.getText() || '').trim();
      if (!rssLink) continue;

      // 1) Ambil dari parameter ?url=
      let real = extractOriginalFromParam(rssLink);

      // 2) Jika belum dapat, coba resolve redirect (max 3 hop)
      if (!real) real = resolveRedirect(rssLink, 3);

      // 3) Bersihkan parameter tracking & amp cache
      const finalLink = sanitizePublisherUrl(real || rssLink);

      if (!seen.has(finalLink)) {
        seen.add(finalLink);
        outLinks.push(finalLink);
      }
    }

    cache.put(cacheKey, JSON.stringify(outLinks), 60 * 30);
    return outLinks.length ? outLinks.join(', ') : 'tidak ada';

  } catch (e) {
    return `ERROR: ${e.message}`;
  }
}

/**
 * Ekstrak link asli dari parameter "url=" bila tersedia.
 */
function extractOriginalFromParam(gnLink) {
  try {
    const u = new URL(gnLink);

    // Varian paling umum
    const direct = u.searchParams.get('url');
    if (direct) return direct;

    // Scan semua param; ambil yang berawalan https:// atau http://
    for (const [k, v] of u.searchParams.entries()) {
      if (!v) continue;
      if (k.toLowerCase() === 'url') return v;
      if (typeof v === 'string' && /^https?:\/\//i.test(v)) return v;
    }

    // Coba deteksi URL terenkode di path
    const decodedPath = decodeURIComponent(u.pathname || '');
    const m = decodedPath.match(/https?:\/\/[^\s"]+/);
    if (m && m[0]) return m[0];

  } catch (_) {}
  return '';
}

/**
 * Ikuti redirect manual untuk dapatkan URL final (tanpa unduh konten penuh).
 */
function resolveRedirect(link, maxHops) {
  let current = link;
  for (let i = 0; i < (maxHops || 3); i++) {
    try {
      const res = UrlFetchApp.fetch(current, {
        muteHttpExceptions: true,
        followRedirects: false,
        method: 'get',
        headers: { 'User-Agent': 'Mozilla/5.0 (AppsScript)' },
      });
      const code = res.getResponseCode();
      if (code >= 300 && code < 400) {
        const headers = res.getHeaders();
        const loc = headers['Location'] || headers['location'];
        if (loc) {
          current = loc;

          // Jika Location berisi ?url=, ambil langsung
          const fromParam = extractOriginalFromParam(current);
          if (fromParam) return fromParam;

          // Jika sudah bukan domain Google News, anggap final
          const host = new URL(current).host || '';
          if (!/news\.google\.com$/i.test(host)) return current;
          continue;
        }
      }
      // Bukan 3xx atau tak ada Location ⇒ anggap final
      return current;
    } catch (_) {
      // Gagal fetch ⇒ kembalikan yang terakhir diketahui
      return current;
    }
  }
  return current;
}

/**
 * Bersihkan URL publisher dari parameter tracking & versi AMP bila mungkin.
 */
function sanitizePublisherUrl(raw) {
  try {
    // Handle link AMP umum: /amp/ atau parameter amp
    let link = raw.replace(/\/amp(\/)?(\?.*)?$/i, '/');

    const u = new URL(link);
    // buang parameter tracking umum
    const dropParams = [
      'utm_source','utm_medium','utm_campaign','utm_term','utm_content',
      'gclid','fbclid','igshid','mc_cid','mc_eid'
    ];
    dropParams.forEach(p => u.searchParams.delete(p));

    // beberapa situs menaruh ?output=amp
    u.searchParams.delete('output');
    // rebuild
    const cleaned = u.origin + u.pathname + (u.search ? `?${u.searchParams.toString()}` : '') + (u.hash || '');
    return cleaned.replace(/\?$/, '');
  } catch (_) {
    return raw;
  }
}
