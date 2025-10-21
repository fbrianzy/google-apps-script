/***************************************
 * Google News Panel (A1-based ranges)
 * Region: single-cell A1 (global for all rows)
 * Menu: News Tools → Open Panel
 ***************************************/

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('News Tools')
    .addItem('Open Panel', 'openNewsPanel')
    .addToUi();
}

function openNewsPanel() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Google News Panel')
    .setWidth(380);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Run batch using A1 notation.
 * Region is a single cell (global).
 * @param {Object} p
 * @param {string=} p.sheetName - Optional sheet name (defaults to active sheet).
 * @param {string} p.kategoriStart - A1 for category start (e.g., B2).
 * @param {string} p.kategoriEnd   - A1 for category end (e.g., B100).
 * @param {string} p.regionCell    - A1 for region cell (e.g., C1).
 * @param {string} p.outputStart   - A1 for output start (e.g., D2).
 * @param {string} p.outputEnd     - A1 for output end (e.g., D100).
 * @param {string} p.startDate     - Inclusive start date (YYYY-MM-DD).
 * @param {string} p.endDateExcl   - Exclusive end date (YYYY-MM-DD).
 * @param {number} p.maxPerCategory - Max links per category.
 * @return {{updated:number, message:string}}
 */
function runBatchA1(p) {
  const ss = SpreadsheetApp.getActive();
  const sh = p.sheetName ? ss.getSheetByName(p.sheetName) : ss.getActiveSheet();
  if (!sh) throw new Error('Sheet not found.');

  // Parse A1
  const kStart = parseCellA1(p.kategoriStart);
  const kEnd   = parseCellA1(p.kategoriEnd);
  const oStart = parseCellA1(p.outputStart);
  const oEnd   = parseCellA1(p.outputEnd);
  const rCell  = parseCellA1(p.regionCell);

  // Ensure single column for category/output blocks
  assertSingleColumn(kStart, kEnd, 'Category');
  assertSingleColumn(oStart, oEnd, 'Output');

  // Row counts to process
  const nCategory = Math.abs(kEnd.row - kStart.row) + 1;
  const nOutput   = Math.abs(oEnd.row - oStart.row) + 1;
  if (!(nCategory > 0 && nOutput > 0)) {
    throw new Error('Invalid category or output range.');
  }
  if (nCategory !== nOutput) {
    throw new Error(
      `Row length mismatch:\n- Category: ${nCategory}\n- Output  : ${nOutput}\nMake them equal (e.g., align D2 → D${kStart.row + nCategory - 1}).`
    );
  }

  // Read ranges
  const catValues = sh.getRange(
    Math.min(kStart.row, kEnd.row), kStart.col, nCategory, 1
  ).getValues(); // Nx1

  const region = (sh.getRange(rCell.row, rCell.col).getValue() || '').toString().trim();

  // Validate dates
  const startDate   = (p.startDate || '').trim();
  const endDateExcl = (p.endDateExcl || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDateExcl)) {
    throw new Error('Date format must be YYYY-MM-DD, e.g., 2025-09-01.');
  }
  const maxPer = Math.max((p.maxPerCategory || 2) | 0, 1);
  const regionUse = region || 'Sidoarjo';

  // Process each row
  const out = new Array(nCategory);
  for (let i = 0; i < nCategory; i++) {
    const category = (catValues[i][0] || '').toString().trim();
    if (!category) { out[i] = ['']; continue; }

    const links = getNewsLinks(category, regionUse, {
      startDate,
      endDateExcl,
      maxPerCategory: maxPer
    });
    out[i] = [links.length ? links.join(', ') : 'none'];

    Utilities.sleep(80); // light throttle
  }

  // Write output in one batch
  const oTopRow = Math.min(oStart.row, oEnd.row);
  const oCol    = oStart.col;
  sh.getRange(oTopRow, oCol, nOutput, 1).setValues(out);

  return { updated: nCategory, message: `Done. Updated ${nCategory} rows (region: ${regionUse}).` };
}

/* =========================
   Core logic: fetch publisher links from Google News RSS
   ========================= */

/**
 * Get list of cleaned publisher URLs for category + location within a date range.
 * @param {string} category
 * @param {string} location
 * @param {{startDate:string, endDateExcl:string, maxPerCategory?:number}} options
 * @return {string[]} Cleaned URLs
 */
function getNewsLinks(category, location, options) {
  category = (category || '').toString().trim();
  location = (location || '').toString().trim();
  if (!category) return [];

  const START_DATE = options?.startDate   || '2025-09-01';
  const END_DATE_EXCL = options?.endDateExcl || '2025-10-01';
  const MAX_PER_CATEGORY = Math.max((options?.maxPerCategory || 2) | 0, 1);

  const hl = 'id', gl = 'ID', ceid = 'ID:id';
  const LOCATION = location || 'Sidoarjo';

  try {
    const query = `"${category}" "${LOCATION}" after:${START_DATE} before:${END_DATE_EXCL}`;
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${ceid}`;

    // Cache for 30 minutes
    const cache = CacheService.getScriptCache();
    const cacheKey = 'rss:' + Utilities.base64Encode([url, MAX_PER_CATEGORY].join('|'));
    const cached = cache.get(cacheKey);
    if (cached) {
      try { const arr = JSON.parse(cached); return Array.isArray(arr) ? arr : []; } catch (_) {}
    }

    const resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (resp.getResponseCode() !== 200) return [];

    const xml = resp.getContentText('UTF-8');
    const doc = XmlService.parse(xml);
    const channel = doc.getRootElement().getChild('channel');
    if (!channel) return [];

    const items = channel.getChildren('item') || [];
    const outLinks = [];
    const seen = new Set();

    for (let i = 0; i < items.length && outLinks.length < MAX_PER_CATEGORY; i++) {
      const item = items[i];
      const linkEl = item.getChild('link'); if (!linkEl) continue;
      const rssLink = (linkEl.getText() || '').trim(); if (!rssLink) continue;

      let real = extractOriginalFromParam(rssLink);
      if (!real) real = resolveRedirect(rssLink, 3);
      const finalLink = sanitizePublisherUrl(real || rssLink);

      if (finalLink && !seen.has(finalLink)) { seen.add(finalLink); outLinks.push(finalLink); }
    }

    cache.put(cacheKey, JSON.stringify(outLinks), 60 * 30);
    return outLinks;

  } catch (_) { return []; }
}

/**
 * (Optional) Custom function for single-cell usage.
 * Use in cell: =GET_NEWS(B2, "Sidoarjo")
 */
function GET_NEWS(category, location) {
  try {
    const links = getNewsLinks(category, location, {
      startDate: '2025-09-01',
      endDateExcl: '2025-10-01',
      maxPerCategory: 2
    });
    return links.length ? links.join(', ') : 'none';
  } catch (e) {
    return `ERROR: ${e.message}`;
  }
}

/* =========================
   Utilities: URL & A1 parser
   ========================= */

/** Extract original URL from "url=" param if present. */
function extractOriginalFromParam(gnLink) {
  try {
    const u = new URL(gnLink);
    const direct = u.searchParams.get('url'); if (direct) return direct;
    for (const [k, v] of u.searchParams.entries()) {
      if (!v) continue;
      if (k.toLowerCase() === 'url') return v;
      if (typeof v === 'string' && /^https?:\/\//i.test(v)) return v;
    }
    const decodedPath = decodeURIComponent(u.pathname || '');
    const m = decodedPath.match(/https?:\/\/[^\s"]+/);
    if (m && m[0]) return m[0];
  } catch (_) {}
  return '';
}

/** Follow redirects manually to get final URL (without downloading full content). */
function resolveRedirect(link, maxHops) {
  let current = link;
  for (let i = 0; i < (maxHops || 3); i++) {
    try {
      const res = UrlFetchApp.fetch(current, {
        muteHttpExceptions: true, followRedirects: false, method: 'get',
        headers: { 'User-Agent': 'Mozilla/5.0 (AppsScript)' },
      });
      const code = res.getResponseCode();
      if (code >= 300 && code < 400) {
        const headers = res.getHeaders();
        const loc = headers['Location'] || headers['location'];
        if (loc) {
          current = loc;
          const fromParam = extractOriginalFromParam(current);
          if (fromParam) return fromParam;
          const host = new URL(current).host || '';
          if (!/news\.google\.com$/i.test(host)) return current;
          continue;
        }
      }
      return current;
    } catch (_) { return current; }
  }
  return current;
}

/** Clean publisher URL: drop tracking params & AMP variants. */
function sanitizePublisherUrl(raw) {
  try {
    let link = raw.replace(/\/amp(\/)?(\?.*)?$/i, '/');
    const u = new URL(link);
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid','igshid','mc_cid','mc_eid','output']
      .forEach(p => u.searchParams.delete(p));
    const qs = u.searchParams.toString();
    return u.origin + u.pathname + (qs ? `?${qs}` : '') + (u.hash || '');
  } catch (_) {
    return raw;
  }
}

/** Parse A1 like "B12" → {row:Number, col:Number} */
function parseCellA1(a1) {
  if (!a1 || typeof a1 !== 'string') throw new Error('A1 is empty.');
  const m = a1.trim().toUpperCase().match(/^([A-Z]+)(\d+)$/);
  if (!m) throw new Error(`Invalid A1: ${a1}`);
  return { col: letterToIndex(m[1]), row: parseInt(m[2], 10) };
}

/** Ensure start & end are on the same column. */
function assertSingleColumn(a, b, label) {
  if (a.col !== b.col) {
    throw new Error(`${label}: start and end must be on the same column (e.g., B2 → B100).`);
  }
}

/** Convert column letters to 1-based index. */
function letterToIndex(letters) {
  let n = 0;
  for (let i = 0; i < letters.length; i++) n = n * 26 + (letters.charCodeAt(i) - 64);
  return n;
}
