// Content for every static page (policies, for-authors, about) — one template renders them all.
import type { StaticBlock, StaticGroup, StaticPageData, StaticSection } from '../../../core/types'

const UPDATED = '2026-08-01'
const generic = (topic: string): StaticSection[] => [
  { heading: 'Scope', paragraphs: [`This policy explains how the journal handles ${topic}. It applies to authors, reviewers, editors and staff, and to all article types published by the journal.`] },
  { heading: 'Our commitments', list: ['We apply this policy consistently and without exception.', 'We explain decisions in writing and respond to queries promptly.', 'We review this policy at least once a year and publish changes with a revision date.'] },
  { heading: 'Questions', paragraphs: ['If anything is unclear, contact the editorial office. We aim to reply within two working days.'] },
]

const P = (slug: string, title: string, intro: string, sections: StaticSection[], related: string[], extra: Partial<StaticPageData> = {}): StaticPageData =>
  ({ slug, group: 'policies', title, intro, sections, updated: UPDATED, related, ...extra })

export const staticPages: StaticPageData[] = [
  P('publication-ethics', 'Publication Ethics', 'The journal is committed to the highest standards of integrity in research and publishing. We follow the principles and flowcharts of the Committee on Publication Ethics (COPE).', [
    { heading: 'Duties of authors', list: ['Submit only original work that has not been published or submitted elsewhere.', 'Acknowledge all sources, contributors and funding.', 'Report errors promptly and cooperate with corrections or retractions.', 'Provide raw data on request where possible.'] },
    { heading: 'Duties of editors', paragraphs: ['Editors evaluate manuscripts solely on scholarly merit, without regard to the authors’ identity, nationality, gender or institution. They keep submitted material confidential and recuse themselves where a conflict exists.'], callout: { tone: 'info', title: 'COPE guidelines', text: 'Cases of suspected misconduct are handled according to the relevant COPE flowchart.' } },
    { heading: 'Duties of reviewers', list: ['Treat manuscripts as confidential documents.', 'Provide objective, constructive and timely feedback.', 'Declare conflicts of interest before accepting an invitation.'] },
    { heading: 'Handling misconduct', paragraphs: ['Allegations of plagiarism, data fabrication, image manipulation or undisclosed duplicate submission are investigated by the editor-in-chief. Outcomes may include correction, expression of concern, retraction and notification of the author’s institution.'] },
  ], ['plagiarism', 'retraction', 'conflict-of-interest'], { principles: true }),
  P('peer-review', 'Peer Review Process', 'Every submission is screened by an editor. When the editor needs expert input, an independent reviewer is invited and a review report is prepared. Every decision is logged with its reason.', [
    { heading: 'Review stages', list: ['Submission: you receive a Paper ID by email, SMS and WhatsApp straight away.', 'Review: the editor screens the paper for scope, quality and plagiarism. A reviewer’s report is added only when the editor asks for one, so this step is optional.', 'Decision: the editor approves, asks for changes or rejects. The reason is logged and a review report PDF is prepared for you.', 'Daily batch: decision and acceptance messages are sent once a day at 08:45 IST.', 'Revisions: changes you make are checked by the handling editor.'] },
    { heading: 'Typical timeline', paragraphs: ['The average time to first decision is about 14 days. Authors can follow every stage at any time on Track My Paper using their Paper ID and email address.'], callout: { tone: 'info', title: 'No account needed', text: 'Authors never need to register. Signing the copyright form uses a one-time code sent to your email.' } },
    { heading: 'When are reviewers used?', paragraphs: ['Editors invite independent reviewers when a paper needs specialist assessment. Reviewers are selected for subject expertise and the absence of conflicts. Authors may suggest reviewers, but editors are not obliged to use them.'] },
  ], ['publication-ethics', 'reviewer-guidelines', 'conflict-of-interest']),
  P('copyright-licensing', 'Copyright and Licensing', 'Authors retain copyright. All articles are published under the Creative Commons Attribution 4.0 International licence (CC BY 4.0).', [
    { heading: 'What CC BY 4.0 allows', list: ['Share — copy and redistribute the material in any medium or format.', 'Adapt — remix, transform and build upon the material for any purpose, including commercially.', 'Attribution is required: give appropriate credit, link to the licence and indicate if changes were made.'] },
    { heading: 'Copyright form', paragraphs: ['After acceptance, the corresponding author signs a copyright and licence-to-publish form through Track My Paper using an email OTP. No printing or scanning is required.'] },
    { heading: 'Third-party material', paragraphs: ['Authors are responsible for obtaining permission to reproduce any third-party figures, tables or text, and for stating the source clearly.'], callout: { tone: 'warn', title: 'Important', text: 'Material that is not covered by CC BY 4.0 must be clearly labelled in the figure or table caption.' } },
  ], ['open-access', 'publication-charges', 'plagiarism']),
  P('open-access', 'Open Access Policy', 'All content is free to read, download and share immediately on publication. There are no subscription or pay-per-view barriers.', [
    { heading: 'Our approach', paragraphs: ['The journal is fully open access. Costs are covered by an article processing charge (APC) payable only after acceptance. Waivers may be considered on request for authors from low-income countries.'] },
    { heading: 'Self-archiving', list: ['Authors may deposit the published version in any institutional or subject repository immediately.', 'Authors may share the article on personal websites and academic social networks.'] },
  ], ['copyright-licensing', 'publication-charges', 'archiving']),
  P('privacy', 'Privacy Policy', 'We collect only the information needed to run the peer-review and publishing process, and we never sell personal data.', [
    { heading: 'What we collect', list: ['Author names, affiliations, email addresses and optional ORCID iDs.', 'WhatsApp or mobile numbers, only to send status updates you have consented to.', 'Basic, anonymised usage statistics for the website.'] },
    { heading: 'How we use it', paragraphs: ['Data is used to process submissions, communicate decisions, issue invoices and certificates, and meet legal obligations. Published author names and affiliations are public by nature of scholarly publishing.'] },
    { heading: 'Your rights', paragraphs: ['You may request access, correction or deletion of your personal data, subject to publishing record-keeping requirements. Email the editorial office to make a request.'] },
  ], ['data', 'copyright-licensing', 'complaints']),
  P('plagiarism', 'Plagiarism Policy', 'The journal screens every submission for similarity using industry-standard software and takes plagiarism very seriously.', [
    { heading: 'Screening', paragraphs: ['Manuscripts are checked on submission and again before acceptance. Similarity above the journal threshold, or any unattributed copying, results in the paper being returned or rejected.'] },
    { heading: 'Acceptable similarity', list: ['Overall similarity should normally be below 15%.', 'No single source should account for more than 3% of the text.', 'Properly cited quotations and standard methods text are not counted against authors.'] },
    { heading: 'Consequences', paragraphs: ['Confirmed plagiarism may lead to rejection, retraction of published work, and notification of the authors’ institutions or funders.'], callout: { tone: 'warn', title: 'Self-plagiarism', text: 'Re-using substantial text from your own earlier publications without citation is also treated as a breach.' } },
  ], ['publication-ethics', 'retraction', 'ai-policy']),
  P('ai-policy', 'AI Policy', 'Generative AI tools may assist with language, but they cannot be authors and their use must be disclosed.', [
    { heading: 'For authors', list: ['AI tools cannot be listed as authors or be held accountable for the work.', 'Disclose any AI tool used for writing or editing in the Methods or Acknowledgements.', 'Authors remain fully responsible for accuracy, originality and citations.', 'Do not use AI to fabricate or manipulate data, images or references.'] },
    { heading: 'For reviewers and editors', paragraphs: ['Manuscripts are confidential. Reviewers and editors must not upload them to public AI tools.'] },
  ], ['publication-ethics', 'plagiarism', 'author-guidelines']),
  P('conflict-of-interest', 'Conflict of Interest', 'Transparency about relationships that could influence work protects readers and researchers alike.', [
    { heading: 'What to declare', list: ['Financial interests, employment, consultancies or equity.', 'Personal or professional relationships relevant to the work.', 'Funding sources and their role in the research.'] },
    { heading: 'Editors and reviewers', paragraphs: ['Editors and reviewers must decline manuscripts where they have a conflict. Editorial board members who submit papers are handled by an independent editor.'] },
  ], ['publication-ethics', 'peer-review', 'editorial-policy']),
  P('retraction', 'Retraction Policy', 'Retraction is a last resort used to correct the literature when findings are unreliable or misconduct is confirmed.', [
    { heading: 'Grounds for retraction', list: ['Clear evidence of unreliable findings from error or fabrication.', 'Plagiarism or redundant publication.', 'Unethical research or undisclosed major conflicts.'] },
    { heading: 'How it is done', paragraphs: ['Retracted articles remain online, clearly watermarked and linked to a retraction notice that explains the reason. The notice is deposited with Crossref and indexing services.'] },
  ], ['corrections', 'publication-ethics', 'plagiarism']),
  P('corrections', 'Corrections and Errata', 'We correct genuine errors quickly and transparently.', [
    { heading: 'Types of correction', list: ['Erratum — an error introduced by the journal.', 'Corrigendum — an error by the authors that affects the record.', 'Expression of concern — when serious doubts remain under investigation.'] },
    { heading: 'Requesting a correction', paragraphs: ['Write to the editorial office with the article DOI and a clear description. Corrections are linked from the original article and indexed.'] },
  ], ['retraction', 'publication-ethics']),
  P('archiving', 'Archiving Policy', 'Long-term preservation ensures that published research remains available.', [
    { heading: 'Preservation', paragraphs: ['Articles are archived in the journal’s repository with multiple backups, and DOIs are registered with Crossref so links remain stable even if the journal moves.'] },
    { heading: 'Repositories', paragraphs: ['Authors are encouraged to deposit their articles in institutional or subject repositories.'] },
  ], ['open-access', 'data']),
  P('author-guidelines', 'Author Guidelines', 'Please read these guidelines before submitting. Following them speeds up review and publication.', [
    { heading: 'Article types', list: ['Research Article — original research (up to 8,000 words).', 'Review Article — critical, systematic reviews (up to 10,000 words).', 'Short Communication — brief reports of preliminary findings (up to 3,000 words).', 'Editorial — by invitation.'] },
    { heading: 'Manuscript preparation', list: ['Use the journal template (Word .doc or .docx).', 'Include title, abstract (max. 250 words), 4–6 keywords, and structured sections.', 'Number references in order of appearance and include DOIs where available.', 'Provide figures at 300 dpi or higher with descriptive captions.'], callout: { tone: 'info', title: 'Submitting is free', text: 'No fee is charged at submission. The APC is payable only after acceptance.' } },
    { heading: 'Declarations', paragraphs: ['Authors must declare originality, no simultaneous submission, funding, conflicts of interest and consent for communications.'] },
  ], ['peer-review', 'publication-charges', 'ai-policy']),
  P('reviewer-guidelines', 'Reviewer Guidelines', 'Reviewers are essential to the quality of the journal. Thank you for contributing your expertise.', [
    { heading: 'What we ask', list: ['Respond to invitations within three days.', 'Return reviews within 7–10 days.', 'Assess originality, methodology, clarity and significance.', 'Be courteous and specific; avoid personal remarks.'] },
    { heading: 'Recognition', paragraphs: ['Reviewers receive a certificate and can request a record of their service for institutional evaluation.'] },
  ], ['peer-review', 'conflict-of-interest']),
  P('editorial-policy', 'Editorial Policy', 'Editorial decisions are independent of commercial considerations and based on scholarly merit.', generic('editorial independence and decision-making'), ['peer-review', 'conflict-of-interest', 'complaints']),
  P('publication-charges', 'Publication Charges', 'The journal charges a one-time article processing charge (APC), payable only after acceptance.', [
    { heading: 'APC', list: ['Indian authors: ₹6,500 + 18% GST.', 'International authors: US$120, no GST.'], callout: { tone: 'info', title: 'What is included', text: 'DOI, certificates for every author, open access hosting and indexing support.' } },
    { heading: 'Payment methods', paragraphs: ['Cards, UPI, net banking and international cards are accepted. Pay using your Paper ID from the Track My Paper page.'] },
    { heading: 'Waivers', paragraphs: ['Waivers or discounts can be requested at submission by authors from low-income countries or without funding.'] },
  ], ['refund', 'open-access', 'author-guidelines']),
  P('refund', 'Refund Policy', 'Payments are refundable only in the circumstances described below.', [
    { heading: 'Eligible for refund', list: ['Duplicate payment for the same Paper ID.', 'Payment made but the paper is not published because of a journal decision or error.'] },
    { heading: 'Not eligible', list: ['Withdrawal after the article is published.', 'Change of mind after publication processing has begun.'] },
    { heading: 'How to request', paragraphs: ['Email the editorial office with your Paper ID and payment reference. Approved refunds are processed within 7–10 working days.'] },
  ], ['publication-charges', 'complaints']),
  P('complaints', 'Complaints and Appeals', 'Authors may appeal an editorial decision or raise a complaint about the process.', [
    { heading: 'Appeals', paragraphs: ['Appeals must be made within 30 days of the decision and should explain, point by point, why the decision should be reconsidered. Appeals are assessed by an editor not involved in the original decision.'] },
    { heading: 'Complaints', paragraphs: ['Complaints about service or conduct are acknowledged within two working days and resolved within 15 working days where possible.'] },
  ], ['editorial-policy', 'publication-ethics']),
  P('data', 'Data Policy', 'We encourage authors to make data openly available to support reproducibility.', [
    { heading: 'Data availability statement', paragraphs: ['All articles must include a statement describing where the underlying data can be found, or why it cannot be shared.'] },
    { heading: 'Recommended practice', list: ['Deposit data in a trusted repository and cite it with a DOI.', 'Use open, non-proprietary file formats.', 'Remove personal identifiers from human-subject data.'] },
  ], ['archiving', 'privacy', 'open-access']),

  // ---- For authors ----
  { slug: 'submission-process', group: 'for-authors', title: 'Submission Process', updated: UPDATED, related: ['author-guidelines', 'templates', 'apc-payment'],
    intro: 'Submitting takes about ten minutes. No account is needed — you receive a Paper ID instantly.',
    sections: [{ heading: 'Steps', list: ['Prepare your manuscript using the journal template.', 'Complete the four-step submission form and upload your Word file.', 'Receive your Paper ID by email, SMS and WhatsApp.', 'Track progress at any time with your Paper ID and email.'] }] },
  { slug: 'templates', group: 'for-authors', title: 'Article Templates', updated: UPDATED, related: ['author-guidelines', 'submission-process'],
    intro: 'Use the official templates to format your manuscript correctly.',
    sections: [{ heading: 'Downloads', list: ['Manuscript template (.docx)', 'Cover letter template (.docx)', 'Response to reviewers template (.docx)'], callout: { tone: 'info', title: 'Prototype note', text: 'Downloads are simulated in this prototype.' } }] },
  { slug: 'apc-payment', group: 'for-authors', title: 'APC & Payment', updated: UPDATED, related: ['publication-charges', 'refund'],
    intro: 'A single, transparent article processing charge is payable after acceptance.',
    sections: [{ heading: 'Charges', list: ['Indian authors: ₹6,500 + 18% GST.', 'International authors: US$120 (no GST).'] }, { heading: 'How to pay', paragraphs: ['Open Track My Paper, enter your Paper ID and email, and choose Pay APC.'] }] },
  { slug: 'become-a-reviewer', group: 'for-authors', title: 'Become a Reviewer', updated: UPDATED, related: ['reviewer-guidelines', 'peer-review'],
    intro: 'Editors invite independent reviewers when a paper needs specialist assessment. We welcome applications from researchers with a PhD or equivalent experience.',
    sections: [{ heading: 'Benefits', list: ['Certificate of reviewing', 'Early access to new research', 'Possible invitation to join the review board'] }, { heading: 'Apply', paragraphs: ['Email your CV, ORCID iD and areas of expertise to the editorial office.'] }] },

  // ---- About ----
  { slug: 'journal-information', group: 'about', title: 'Journal Information', updated: UPDATED, related: ['aims-scope', 'indexing', 'contact'],
    intro: 'The official record of the journal: title, frequency, identifiers, publisher and how to reach the editorial office.',
    sections: [] },
  { slug: 'aims-scope', group: 'about', title: 'Aims & Scope', updated: UPDATED, related: ['indexing', 'contact'],
    intro: 'The journal publishes rigorous, original research that advances science and benefits society.',
    sections: [{ heading: 'Subject areas', list: ['Materials Science', 'Environmental Science', 'Computer Science', 'Biotechnology', 'Energy Systems', 'Public Health'] }, { heading: 'Types of work', paragraphs: ['We publish research articles, reviews and short communications, and welcome replication studies and negative results.'] }] },
  { slug: 'indexing', group: 'about', title: 'Indexing & Abstracting', updated: UPDATED, related: ['aims-scope', 'contact'],
    intro: 'Articles are made discoverable through the databases and services listed below.',
    sections: [{ heading: 'Services', list: ['Google Scholar — articles carry Scholar-compatible metadata.', 'Crossref — every article has a registered DOI.', 'BASE and OpenAlex — open access discovery.'], callout: { tone: 'warn', title: 'Client to confirm', text: 'Only list databases that actually index the journal before launch.' } }] },
  { slug: 'contact', group: 'about', title: 'Contact', updated: UPDATED, related: ['aims-scope', 'complaints'],
    intro: 'Our editorial office replies within two working days.',
    sections: [] },
]

const BLOCKS: Record<string, StaticBlock[]> = {
  'author-guidelines': [
    { type: 'downloads', title: 'Templates and checklists', items: [
      { name: 'Manuscript template', desc: 'Formatted headings, tables and reference style.', format: 'DOCX · 48 KB' },
      { name: 'Cover letter template', desc: 'A short structure editors find helpful.', format: 'DOCX · 22 KB' },
      { name: 'Submission checklist', desc: 'One-page checklist to use before you submit.', format: 'PDF · 96 KB' },
    ] },
  ],
  templates: [
    { type: 'downloads', title: 'Download templates', items: [
      { name: 'Manuscript template', desc: 'Use this for research articles, reviews and short communications.', format: 'DOCX · 48 KB' },
      { name: 'Cover letter template', desc: 'Explain the significance of your work to the editor.', format: 'DOCX · 22 KB' },
      { name: 'Response to reviewers', desc: 'Point-by-point reply format for revisions.', format: 'DOCX · 30 KB' },
    ] },
  ],
  'submission-process': [
    { type: 'steps', title: 'The eight stages of a paper', items: [
      { title: 'Submission', text: 'Submit on the website or on WhatsApp. No account is needed, and your Paper ID arrives by email, SMS and WhatsApp.' },
      { title: 'Review', text: 'The editor screens your paper. An external reviewer is consulted only when the editor needs one.' },
      { title: 'Decision', text: 'The editor approves, asks for changes or rejects, and the reason is logged. Messages go out daily at 08:45 IST.' },
      { title: 'Acceptance', text: 'You receive the acceptance letter, a copyright form to sign with an email OTP, and the payment link.' },
      { title: 'Payment', text: 'Pay online in INR or USD, or upload your UPI or bank proof. You get a GST invoice once it is confirmed.' },
      { title: 'Production', text: 'The associate editor checks content and metadata while your Word file is converted into the web article.' },
      { title: 'Publication', text: 'After final approval your article goes live with a DOI, and certificates with QR codes are emailed to every author.' },
      { title: 'Indexing', text: 'We check Google Scholar every week and email you as soon as your article is indexed.' },
    ] },
  ],
  'peer-review': [
    { type: 'flow', title: 'Peer review at a glance', nodes: [
      { label: 'Submission', note: 'Paper ID issued' }, { label: 'Editor screening', note: 'Scope, quality, plagiarism' },
      { label: 'Reviewer', note: 'Optional, if needed' }, { label: 'Decision', note: 'Reason is logged' },
      { label: 'Acceptance', note: 'Letter and copyright form' }, { label: 'Publication', note: 'DOI and certificates' },
    ] },
  ],
  'apc-payment': [
    { type: 'faq', title: 'Frequently asked questions', items: [
      { q: 'When do I pay?', a: 'Only after your paper is accepted. Nothing is charged at submission or during peer review.' },
      { q: 'Is GST charged?', a: 'Indian authors pay 18% GST on the APC and receive a GST invoice. International authors pay no GST.' },
      { q: 'Which payment methods are accepted?', a: 'UPI, debit and credit cards, net banking and international cards.' },
      { q: 'Can I get a waiver?', a: 'Authors from low-income countries or without funding can request a waiver at submission. Requests are reviewed by the editor-in-chief.' },
      { q: 'How do I pay?', a: 'Open Track My Paper, enter your Paper ID and email, and choose Pay APC.' },
      { q: 'Can I get a refund?', a: 'Refunds are possible for duplicate payments or if the paper is not published. See the Refund Policy.' },
    ] },
  ],
  'become-a-reviewer': [{ type: 'reviewer-form', title: 'Reviewer application' }],
  'journal-information': [{ type: 'journal-info' }],
  'aims-scope': [
    { type: 'icon-grid', title: 'Scope areas', items: [
      { icon: 'database', title: 'Materials Science', text: 'Composites, coatings, nanomaterials and sustainable materials.' },
      { icon: 'globe', title: 'Environmental Science', text: 'Water, air and soil quality, climate and remote sensing.' },
      { icon: 'scan-search', title: 'Computer Science', text: 'Machine learning, edge computing, privacy and systems.' },
      { icon: 'shield-check', title: 'Biotechnology', text: 'Synthetic biology, diagnostics and bioprocess engineering.' },
      { icon: 'zap', title: 'Energy Systems', text: 'Renewables, storage, grids and techno-economics.' },
      { icon: 'users', title: 'Public Health', text: 'Community health, epidemiology and health systems.' },
    ] },
  ],
  indexing: [{ type: 'indexing-grid', title: 'Where the journal is indexed' }],
  contact: [{ type: 'contact-details' }, { type: 'contact-form', title: 'Send us a message' }],
}
staticPages.forEach((p) => { if (BLOCKS[p.slug]) p.blocks = BLOCKS[p.slug] })

export const pageBySlug = (slug: string) => staticPages.find((p) => p.slug === slug)
export const pagesInGroup = (g: StaticGroup) => staticPages.filter((p) => p.group === g)
