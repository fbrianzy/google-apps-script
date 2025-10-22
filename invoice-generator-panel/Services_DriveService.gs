/** Drive helpers (if needed later) */
var Services_DriveService = (function() {
  function ensureFolder(parentId, name) {
    var parent = DriveApp.getFolderById(parentId);
    var it = parent.getFoldersByName(name);
    if (it.hasNext()) return it.next();
    return parent.createFolder(name);
  }
  return { ensureFolder: ensureFolder };
})();
