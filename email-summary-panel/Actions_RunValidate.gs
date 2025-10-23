/** Validate payload and required fields */
var Actions_RunValidate = (function () {
  function run(p) {
    // Required minimal fields
    var req = ['sheetName', 'dateStart', 'dateEnd', 'maxEmails', 'writeMode'];
    req.forEach(function (k) {
      if (p[k] == null || p[k] === '') throw new Error('Missing field: ' + k);
    });

    // Dates
    var ds = DateUtils.parseYMD(String(p.dateStart));
    var de = DateUtils.parseYMD(String(p.dateEnd));
    if (!ds || !de) throw new Error('Invalid date format. Use YYYY-MM-DD.');
    if (de.getTime() < ds.getTime()) throw new Error('End date must be after start date.');

    // Max emails
    var max = Number(p.maxEmails);
    if (!(max > 0 && max <= 2000)) throw new Error('maxEmails must be between 1 and 2000.');

    // Sheet exists?
    var sh = Services_SheetService.getOrCreateSheet(p.sheetName);
    if (!sh) throw new Error('Failed to open or create sheet: ' + p.sheetName);

    return { ok: true, message: 'Validation OK' };
  }
  return { run: run };
})();
