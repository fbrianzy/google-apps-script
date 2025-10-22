/** Email service to send invoice PDF to client (optional) */
var Services_EmailService = (function() {
  function sendInvoice(rec, pdfId, invoiceNo) {
    try {
      var pdf = DriveApp.getFileById(pdfId);
      var subject = 'Invoice ' + invoiceNo + ' - ' + (rec.clientName || '');
      var body = 'Dear ' + (rec.clientName || 'Customer') + ',

Please find your invoice attached.

Best regards,';
      MailApp.sendEmail({
        to: rec.clientEmail,
        subject: subject,
        body: body,
        attachments: [pdf.getAs('application/pdf')]
      });
      Log.info('Email sent', { to: rec.clientEmail, invoice: invoiceNo });
    } catch (e) {
      Log.warn('Failed to send email', { error: e });
    }
  }
  return { sendInvoice: sendInvoice };
})();
