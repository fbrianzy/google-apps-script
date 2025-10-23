/** App-wide constants */
var AppConfig = {
  APP_NAME: 'Email Summary Panel',
  DEFAULT_SHEET: 'Emails',
  DEFAULT_TIMEZONE: Session.getScriptTimeZone() || 'Asia/Jakarta',
  DEFAULT_MAX_EMAILS: 100,
  DEFAULT_WRITE_MODE: 'CLEAR_WRITE', // 'APPEND' | 'CLEAR_WRITE'
  OUTPUT_HEADERS: [
    'Date', 'From Name', 'From Email', 'Subject', 'Snippet',
    'Labels', 'Message ID', 'Thread ID', 'Message URL'
  ]
};
