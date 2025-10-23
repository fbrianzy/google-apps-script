/** Lightweight logger */
var Log = (function () {
  function info(msg, obj) { _log('INFO', msg, obj); }
  function warn(msg, obj) { _log('WARN', msg, obj); }
  function error(msg, obj) { _log('ERROR', msg, obj); }
  function _log(level, msg, obj) {
    var text = '[' + level + '] ' + msg + (obj ? ' ' + JSON.stringify(obj) : '');
    console.log(text);
  }
  return { info: info, warn: warn, error: error };
})();
