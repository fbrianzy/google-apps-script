/** Create Google Doc from template and replace placeholders. */
var Services_DocService = (function() {

  function createFromTemplate(templateDocId, rec, invoiceNo) {
    var tplFile = DriveApp.getFileById(templateDocId);
    var name = invoiceNo + ' - ' + (rec.clientName || 'Invoice');
    var newFile = tplFile.makeCopy(name);
    var doc = DocumentApp.openById(newFile.getId());
    var body = doc.getBody();

    // Basic replacements
    var map = {
      '{{INVOICE_NUMBER}}': invoiceNo,
      '{{CLIENT_NAME}}': rec.clientName || '',
      '{{CLIENT_EMAIL}}': rec.clientEmail || '',
      '{{INVOICE_DATE}}': Utilities.formatDate(rec.invoiceDate, AppConfig.DEFAULT_TIMEZONE, 'yyyy-MM-dd'),
      '{{DUE_DATE}}': rec.dueDate ? Utilities.formatDate(rec.dueDate, AppConfig.DEFAULT_TIMEZONE, 'yyyy-MM-dd') : '',
      '{{CURRENCY}}': rec.currency || '',
      '{{SUBTOTAL}}': StringUtils.formatMoney(rec.subtotal, rec.currency),
      '{{TAX}}': StringUtils.formatMoney(rec.tax, rec.currency),
      '{{TOTAL}}': StringUtils.formatMoney(rec.total, rec.currency),
      '{{DISCOUNT}}': StringUtils.formatMoney(rec.discountAmount, rec.currency),
      '{{TAX_RATE}}': String(rec.taxRate) + '%',
      '{{STATUS}}': rec.status || AppConfig.DEFAULT_STATUS,
      '{{NOTES}}': rec.notes || ''
    };
    Object.keys(map).forEach(function(k){
      body.replaceText(k, map[k]);
    });

    // Insert items table where {{ITEMS_TABLE}} placeholder is
    insertItemsTable(body, rec);

    // Company info (optional via script props)
    insertCompanyInfo(body);

    doc.saveAndClose();
    return newFile.getId();
  }

  function insertItemsTable(body, rec) {
    var spot = body.findText('{{ITEMS_TABLE}}');
    if (spot) {
      var el = spot.getElement();
      el.asText().setText(''); // clear placeholder
      var p = el.getParent().asParagraph();
      body.insertTable(body.getChildIndex(p) + 1, buildItemsTable(rec.items, rec.currency));
    } else {
      // Append at end if placeholder missing
      body.appendParagraph('Items');
      body.appendTable(buildItemsTable(rec.items, rec.currency));
    }
  }

  function buildItemsTable(items, currency) {
    var data = [['Description','Qty','Unit Price','Amount']];
    items.forEach(function(it){
      data.push([it.desc, String(it.qty), StringUtils.formatMoney(it.unit, currency), StringUtils.formatMoney(it.amount, currency)]);
    });
    return data;
  }

  function insertCompanyInfo(body) {
    var companyName = Properties.getScript(AppConfig.COMPANY_PROPS_PREFIX + 'NAME', '');
    var companyAddr = Properties.getScript(AppConfig.COMPANY_PROPS_PREFIX + 'ADDRESS', '');
    if (companyName) body.replaceText('{{COMPANY_NAME}}', companyName);
    if (companyAddr) body.replaceText('{{COMPANY_ADDRESS}}', companyAddr);

    var logoId = Properties.getScript(AppConfig.COMPANY_PROPS_PREFIX + 'LOGO_ID', '');
    if (logoId) {
      var spot = body.findText('{{COMPANY_LOGO}}');
      if (spot) {
        var el = spot.getElement();
        el.asText().setText('');
        try {
          var blob = DriveApp.getFileById(logoId).getBlob();
          var p = el.getParent().asParagraph();
          p.insertInlineImage(0, blob);
        } catch (e) {
          Log.warn('Failed to insert logo', { error: e });
        }
      }
    }
  }

  return {
    createFromTemplate: createFromTemplate
  };
})();
