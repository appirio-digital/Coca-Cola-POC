export function setup(headerFn, bodyFn, footerFn) {
  cbHeader = headerFn;
  cbFooter = footerFn;
  cbBody = bodyFn;
}

export function renderDocument(
  documentHeader,
  documentBody,
  documentLineItems,
  documentPageFooter
) {
  var header = renderHeader(documentHeader);
  var body = renderBody(documentBody, documentLineItems);
  var pageFooter = renderPageFooter(documentPageFooter);
  return header + body + pageFooter;
}

function renderHeader(header) {
  return cbHeader({ rawHeader: header });
}

function renderPageFooter(footer) {
  return cbFooter({ rawFooter: footer });
}

function renderBody(body, lineItems) {
  return cbBody({ rawBody: body, lineItems });
}

//New Function
export function renderInvoiceDocument(documentTemplate) {
  return documentTemplate;
}
