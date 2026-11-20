// Runs on each Google Form submission (installable "On form submit" trigger on the response sheet).
// - Writes a ticket ID into a "Ticket ID" column (added automatically, so form data is never overwritten)
// - Optionally emails a confirmation (off by default; set SEND_EMAIL = true to enable)

const SEND_EMAIL = false;
const EMAIL_FIELD = 'Email Address';      // form question (or "Collect email addresses" setting) holding the submitter's email
const TICKET_HEADER = 'Ticket ID';
const TICKET_START = 1000;                // first ticket is TKT-1001

function onFormSubmit(e) {
  const sheet = e.range.getSheet();
  const row = e.range.getRow();
  const ticketCol = getTicketColumn(sheet);
  const ticketId = 'TKT-' + (TICKET_START + row - 1);

  sheet.getRange(row, ticketCol).setValue(ticketId);

  if (!SEND_EMAIL) return;

  const email = first(e.namedValues[EMAIL_FIELD]);
  if (!email) {
    console.warn('No "' + EMAIL_FIELD + '" value on ' + ticketId + '; confirmation email skipped.');
    return;
  }
  const issueType = first(e.namedValues['Issue Type']) || 'IT issue';
  const urgency = first(e.namedValues['Urgency']) || 'Normal';

  GmailApp.sendEmail(
    email,
    'Ticket Received (' + ticketId + '): ' + issueType,
    'Your ticket ' + ticketId + ' is ' + urgency + ' priority. We\'ll contact you soon.'
  );
}

function getTicketColumn(sheet) {
  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const idx = headers.indexOf(TICKET_HEADER);
  if (idx !== -1) return idx + 1;
  sheet.getRange(1, lastCol + 1).setValue(TICKET_HEADER);
  return lastCol + 1;
}

function first(value) {
  return Array.isArray(value) ? String(value[0] || '').trim() : String(value || '').trim();
}
