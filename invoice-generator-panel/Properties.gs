/**
 * Script & User properties helpers (for numbering, company profile, etc.)
 */
var Properties = (function() {
  var scriptProps = PropertiesService.getScriptProperties();
  var userProps = PropertiesService.getUserProperties();

  function getScript(key, def) {
    var v = scriptProps.getProperty(key);
    return v != null ? v : def;
  }
  function setScript(key, val) {
    scriptProps.setProperty(key, String(val));
  }

  function getUser(key, def) {
    var v = userProps.getProperty(key);
    return v != null ? v : def;
  }
  function setUser(key, val) {
    userProps.setProperty(key, String(val));
  }

  return {
    getScript: getScript,
    setScript: setScript,
    getUser: getUser,
    setUser: setUser
  };
})();
