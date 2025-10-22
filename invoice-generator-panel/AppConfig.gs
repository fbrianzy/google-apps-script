/** App-wide constants & formats */
var AppConfig = {
  APP_NAME: 'Invoice Generator Panel',
  DATE_FMT: 'yyyy-MM-dd',
  NUMBERING_PREFIX: 'INV',
  DEFAULT_TIMEZONE: Session.getScriptTimeZone() || 'Asia/Jakarta',
  COMPANY_PROPS_PREFIX: 'COMPANY_', // e.g., COMPANY_NAME, COMPANY_ADDRESS, COMPANY_LOGO_ID
  DEFAULT_STATUS: 'Draft'
};
