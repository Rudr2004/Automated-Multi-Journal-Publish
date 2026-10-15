// Shared wording of the "APC & Payment" page (from the client's APC prototype). Each journal renders it in its own design; amounts come from journal.apc.
export const APC_INCLUDED: [title: string, text: string][] = [
  ['Certificate for every author', 'Individual digital publication certificate for each co-author, with title, journal, volume and issue.'],
  ['DOI via Crossref', 'A permanent, citable DOI registered through Crossref for your article.'],
  ['Permanent archiving', 'Your published article is preserved long term, so it stays accessible.'],
  ['Fast online publication', 'Published online within 24 hours of acceptance.'],
  ['Open access visibility', 'Free to read and download worldwide, with no paywall for readers.'],
  ['Professional typesetting', 'Your manuscript is formatted into a clean, journal-standard PDF and web (HTML) version.'],
  ['Discoverability', 'Metadata prepared for Google Scholar and other academic search tools.'],
  ['Plagiarism screening', 'Similarity check carried out before publication.'],
  ['You keep your copyright', 'Authors retain copyright. Articles are published under an open licence.'],
  ['Author support', 'Help from the editorial office by email until your article is live.'],
]

export const APC_STEPS = ['Submit your manuscript', 'Peer review and editorial decision', 'Pay the APC, only after acceptance', 'Article published online with DOI']

export const APC_INSTITUTION_NOTES = [
  "Invoice issued in the institution's name with GSTIN, billing address and purchase order number, if provided.",
  'If your institution deducts TDS, please mention it when requesting the invoice and share the TDS certificate afterwards.',
  'Paying for several articles? Contact the editorial office for a consolidated invoice.',
  'Publication follows acceptance and payment confirmation. Payment never influences the editorial decision.',
  'Please quote the Manuscript ID as the payment reference.',
]

export const apcFaq = (gstPercent: number): [string, string][] => [
  ['Can my institution or funder pay instead of me?', "Yes. Choose \"Institution or funder\" when you pay and enter the institution's billing details. The tax invoice will be issued in its name."],
  ['Can we pay by bank transfer against a purchase order?', 'Yes. Select "Bank transfer" to request a proforma invoice. After payment, email the transaction reference to the editorial office so it can be matched to the manuscript.'],
  ['When do I need to pay?', 'Only after your manuscript is accepted. You will receive a payment link by email along with the acceptance notification.'],
  ['Is GST included?', `No. GST at ${gstPercent}% is added on top. A GST-compliant invoice is issued after payment.`],
  ['Which payment methods are accepted?', 'UPI, debit and credit cards, net banking and wallets through our secure payment gateway.'],
  ['Does the fee cover all authors?', 'Yes. The fee is per article, regardless of the number of authors, and every author receives a certificate.'],
  ['Can I get a fee waiver?', 'Waivers may be considered for authors with genuine financial hardship. Write to the editorial office before payment with a short request.'],
  ['What is the refund policy?', 'Once the article is published online, the fee is non-refundable. If a payment fails or is charged twice, the amount is refunded to the original payment method.'],
]
