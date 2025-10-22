/**
 * Invoice Generator Panel v2 - Apps Script (Flat files layout)
 * Entry point: menu + sidebar bootstrap + router.
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Invoice Tools')
    .addItem('Open Panel', 'openInvoicePanel')
    .addToUi();
}

function openInvoicePanel() {
  const html = HtmlService.createTemplateFromFile('UI_Sidebar')
    .evaluate()
    .setTitle('Invoice Generator Panel')
    .setWidth(460);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Router called by client (UI) to run actions.
 * @param {string} action - 'preview' | 'generate' | 'validate'
 * @param {Object} payload - panel config & mapping
 * @return {Object} result
 */
function runAction(action, payload) {
  Log.info('runAction', { action });

  switch (action) {
    case 'validate':
      return Actions_RunValidate.run(payload);
    case 'preview':
      return Actions_RunPreview.run(payload);
    case 'generate':
      return Actions_RunGenerate.run(payload);
    default:
      throw new Error('Unknown action: ' + action);
  }
}

/** Include HTML partials (CSS/JS) */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
