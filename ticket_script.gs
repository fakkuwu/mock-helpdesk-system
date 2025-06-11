function onFormSubmit(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const row = sheet.getLastRow();

  // Auto-assign ticket ID
  sheet.getRange(row, 1).setValue(`TKT-${row}000`);

  // Auto-reply (replace with your email)
  const email = e.namedValues['Employee Name'] + "@yourcompany.com";
  GmailApp.sendEmail(
    email,
    "Ticket Received: " + e.namedValues['Issue Type'],
    `Your ticket (TKT-${row}000) is ${e.namedValues['Urgency']} priority. We'll contact you soon.`
  );
}