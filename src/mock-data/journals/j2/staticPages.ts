// Journal 2 (JIMRT) static pages: policies, for authors and about. Original text for this journal only.
// Facts (ISSN, DOI prefix, APC, indexing) mirror src/config/journals/j2.ts. Memberships and indexing the journal does not hold are not claimed.
import type { StaticBlock, StaticPageData, StaticSection } from '../../../core/types'

const UPDATED = '2026-09-15'
const NAME = 'Journal of Innovation in Multidisciplinary Research and Technology (JIMRT)'

const P = (slug: string, title: string, intro: string, sections: StaticSection[], related: string[], extra: Partial<StaticPageData> = {}): StaticPageData =>
  ({ slug, group: 'policies', title, intro, sections, updated: UPDATED, related, ...extra })
const A = (slug: string, title: string, intro: string, sections: StaticSection[], related: string[], blocks?: StaticBlock[]): StaticPageData =>
  ({ slug, group: 'for-authors', title, intro, sections, updated: UPDATED, related, blocks })
const B = (slug: string, title: string, intro: string, sections: StaticSection[], related: string[], blocks?: StaticBlock[]): StaticPageData =>
  ({ slug, group: 'about', title, intro, sections, updated: UPDATED, related, blocks })

export const staticPages: StaticPageData[] = [
  // ---------------- Policies ----------------
  P('publication-ethics', 'Publication Ethics',
    `${NAME} expects honesty and care from everyone who writes, reviews or edits for it. This page sets out the standards we hold ourselves to.`,
    [
      { heading: 'Our standards', paragraphs: ['Our practice is aligned with COPE-style guidance on good publication practice. JIMRT is not a COPE member; we use these widely shared principles as a reference for how we behave and how we handle problems.'], list: ['Research must be original, honestly reported and based on data the authors can show.', 'Authorship is limited to people who made a substantial contribution and who approve the final text.', 'Editors decide on scientific merit alone, regardless of an author’s nationality, gender, belief or institution.', 'Reviewers treat manuscripts as confidential and declare any conflict before accepting.'] },
      { heading: 'Research involving people and animals', paragraphs: ['Studies with human participants must state the ethics committee that approved them and confirm informed consent. Animal studies must name the approving body and follow the applicable welfare rules. Editors may ask for the approval letter at any stage.'] },
      { heading: 'Duplicate and redundant publication', paragraphs: ['A manuscript must not be under consideration elsewhere. Text, figures or data that already appeared in another venue must be cited, and substantial overlap with earlier work is grounds for rejection or retraction.'] },
      { heading: 'Reporting a concern', paragraphs: [`Write to ${'editor@jimrt.org'} with the Paper ID or article DOI and a short description. Concerns are handled in confidence and investigated before any action is taken.`], callout: { tone: 'info', title: 'Fair process', text: 'Everyone named in a concern is given a chance to respond before the editor decides.' } },
    ], ['plagiarism', 'conflict-of-interest', 'retraction'], { principles: true }),

  P('peer-review', 'Peer Review Process',
    'Every submission is read by an editor and, if it fits the journal, assessed by independent experts before a decision is made.',
    [
      { heading: 'Model of review', paragraphs: ['JIMRT uses single-anonymised peer review: reviewers can see who wrote the paper, while authors never learn who reviewed it. Reviewers are asked to comment on the work, not the people behind it.'] },
      { heading: 'What happens to your paper', list: ['Editorial screening: scope, completeness, language level and a similarity check.', 'Reviewer assessment: at least two independent subject experts are invited for papers that pass screening.', 'Decision: accept, minor revision, major revision or reject, with the editor’s reasons recorded.', 'Revision: authors reply point by point; the editor may return a revised paper to the same reviewers.'] },
      { heading: 'Timelines', paragraphs: ['Screening usually takes three to five working days. A first decision is normally sent within three to four weeks of submission. You can follow each step at any time on the Track My Paper page with your Paper ID.'] },
      { heading: 'Editorial independence', paragraphs: ['Editors do not handle papers from their own institution or from people they have worked with recently. Such papers are passed to another editor.'] },
    ], ['editorial-policy', 'reviewer-guidelines', 'complaints'],
    { blocks: [{ type: 'flow', title: 'Peer review at a glance', nodes: [
      { label: 'Submission', note: 'Paper ID issued' }, { label: 'Screening', note: 'Scope and similarity' }, { label: 'Expert review', note: 'Two or more reviewers' },
      { label: 'Decision', note: 'Reasons recorded' }, { label: 'Revision', note: 'If requested' }, { label: 'Publication', note: 'DOI assigned' },
    ] }] }),

  P('copyright-licensing', 'Copyright and Licensing',
    'Authors keep the copyright to their work. Readers are free to reuse it as long as they give credit.',
    [
      { heading: 'Author copyright', paragraphs: ['You retain copyright and grant JIMRT the right to publish the article first. There is no transfer of copyright to the publisher, and you may deposit your own article in any repository or share it on your own website.'] },
      { heading: 'Licence', paragraphs: ['All articles are published under the Creative Commons Attribution 4.0 International licence (CC BY 4.0). Anyone may copy, adapt and redistribute the article, including commercially, provided the original authors and source are credited and changes are indicated.'] },
      { heading: 'Third-party material', list: ['You are responsible for permission to include figures, tables or images taken from other sources.', 'Material that is not covered by CC BY 4.0 must be clearly marked with its source and terms.', 'Do not submit content that you do not have the right to publish.'] },
      { heading: 'Publishing agreement', paragraphs: ['On acceptance, the corresponding author signs a short publishing agreement confirming originality, authorship and the CC BY 4.0 licence.'] },
    ], ['open-access', 'plagiarism', 'publication-ethics']),

  P('open-access', 'Open Access Policy',
    'Every JIMRT article is free to read, download and share from the day it is published.',
    [
      { heading: 'Immediate and full', paragraphs: ['Articles are open to everyone, with no registration, subscription or embargo. The final version appears with its DOI as soon as the issue is released.'] },
      { heading: 'How it is funded', paragraphs: ['Reading is free, so costs are covered by a one-time article processing charge (APC) paid by authors or their funders after acceptance. The charge never influences the editorial decision, and editors do not see payment status when deciding.'] },
      { heading: 'Reuse rights', paragraphs: ['Articles carry the CC BY 4.0 licence. Text and data mining are permitted with attribution.'] },
      { heading: 'Self-archiving', paragraphs: ['Authors may post any version of their paper, including the published PDF, on personal pages, institutional repositories or preprint servers, with a link back to the JIMRT DOI.'] },
    ], ['copyright-licensing', 'publication-charges', 'archiving']),

  P('privacy', 'Privacy Policy',
    'This policy explains which personal data the journal collects, why, and what you can ask us to do with it.',
    [
      { heading: 'What we collect', list: ['Author and co-author names, affiliations and email addresses given at submission.', 'Reviewer and editor profile details.', 'Messages sent through the contact and reviewer forms.', 'Payment references for the APC. Card and bank details are handled by the payment provider and are not stored by the journal.'] },
      { heading: 'How we use it', paragraphs: ['We use your data to run peer review, send status messages, issue invoices and certificates, register DOIs and answer enquiries. We do not sell personal data or use it for advertising.'] },
      { heading: 'What is public', paragraphs: ['Published articles show author names, affiliations and, where supplied, ORCID iDs and a corresponding-author email. This is part of the scholarly record and remains visible after publication.'] },
      { heading: 'Your choices', paragraphs: [`You can ask to see, correct or delete personal data that is not part of the published record by writing to editor@jimrt.org. We reply within thirty days. Anonymous visit statistics may be kept to understand how the site is used.`] },
    ], ['data', 'complaints', 'publication-ethics']),

  P('plagiarism', 'Plagiarism Policy',
    'Submitted work must be the authors’ own. Every manuscript is checked for overlap before it goes to review.',
    [
      { heading: 'What counts as plagiarism', list: ['Copying text, data, figures or ideas without credit.', 'Close paraphrasing of another source without citation.', 'Reusing your own published work without disclosure (text recycling).', 'Fabricated or manipulated data or images.'] },
      { heading: 'Similarity check', paragraphs: ['Manuscripts are screened with similarity-detection software. A report is a tool for editors, not a verdict: quoted passages, methods descriptions and references are weighed in context. Papers with substantial unexplained overlap are returned to the authors or rejected.'] },
      { heading: 'If plagiarism is found after publication', paragraphs: ['The editor contacts the authors, reviews their response and, where the problem is confirmed, publishes a correction or retraction notice and may inform the authors’ institution.'] },
      { heading: 'Preprints', paragraphs: ['A preprint of the same work is not treated as prior publication, but it must be declared in the cover letter.'] },
    ], ['publication-ethics', 'retraction', 'ai-policy']),

  P('ai-policy', 'AI Policy',
    'AI tools can help with language and analysis, but people remain responsible for everything we publish.',
    [
      { heading: 'For authors', list: ['AI tools cannot be listed as authors because they cannot take responsibility for the work.', 'Disclose any generative AI used in writing, analysis or figure creation, naming the tool and how it was used, in the Methods or Acknowledgements.', 'Authors are accountable for the accuracy of AI-assisted text, including every reference and number.', 'Do not present AI-generated images or data as real observations.'] },
      { heading: 'For reviewers and editors', paragraphs: ['Manuscripts are confidential. Reviewers and editors must not upload them to public AI services. Basic language-checking tools that do not store text are acceptable, and the review itself must be the reviewer’s own judgement.'] },
      { heading: 'Language editing', paragraphs: ['Using software only to improve grammar or spelling does not need to be declared.'] },
    ], ['plagiarism', 'author-guidelines', 'reviewer-guidelines']),

  P('conflict-of-interest', 'Conflict of Interest',
    'A conflict of interest is anything that could reasonably be seen to affect how research is reported or judged. Declare it and let the reader decide.',
    [
      { heading: 'What to declare', list: ['Funding sources and the role the funder had in the study.', 'Employment, consultancy, patents or shares linked to the topic.', 'Close personal or professional relationships with people affected by the work.'] },
      { heading: 'Authors', paragraphs: ['Add a Declaration of Interests section to the manuscript. If there is nothing to declare, say so.'] },
      { heading: 'Reviewers and editors', paragraphs: ['Decline an invitation if you collaborated with an author in the last three years, share an institution, or have a financial or personal stake. Editors recuse themselves from papers where they have such links.'] },
      { heading: 'Undisclosed conflicts', paragraphs: ['If a conflict emerges later, the editor may publish a correction and, in serious cases, treat it as a breach of publication ethics.'] },
    ], ['publication-ethics', 'editorial-policy', 'reviewer-guidelines']),

  P('retraction', 'Retraction Policy',
    'Retraction protects the scholarly record when an article cannot be relied on. It is used carefully and openly.',
    [
      { heading: 'When we retract', list: ['Clear evidence of fabricated or falsified data.', 'Major, unintentional errors that invalidate the conclusions.', 'Plagiarism or duplicate publication.', 'Publication without required ethical approval or consent.', 'Authorship or peer review manipulation.'] },
      { heading: 'How it is done', paragraphs: ['The retraction notice is linked to the article, states the reason and who requested it, and is free to read. The original PDF stays online, marked “Retracted”, so the record is not erased. The DOI metadata is updated to show the status.'] },
      { heading: 'Process', paragraphs: ['The editor-in-chief reviews the evidence, asks the authors to respond and may seek independent advice before deciding. Authors are told the outcome before the notice appears.'] },
    ], ['corrections', 'plagiarism', 'complaints']),

  P('corrections', 'Corrections and Errata',
    'Honest mistakes happen. When they affect the meaning of an article, we publish a visible correction.',
    [
      { heading: 'Types of correction', list: ['Erratum: an error made by the journal during production.', 'Corrigendum: an error made by the authors that changes how the work is read.', 'Minor typographical fixes that do not affect meaning may be made in place with a version note.'] },
      { heading: 'How to request one', paragraphs: ['The corresponding author writes to the editorial office with the Paper ID, the exact change and the reason. The editor approves the wording before it is published.'] },
      { heading: 'Where it appears', paragraphs: ['A notice is added to the original article page and published as its own item with a DOI that points to the original. Both records link to each other.'] },
    ], ['retraction', 'publication-ethics', 'archiving']),

  P('archiving', 'Archiving Policy',
    'We keep every published article accessible and take steps so that it stays citable if the journal website changes.',
    [
      { heading: 'Permanent identifiers', paragraphs: ['Each article has a Crossref DOI under the prefix 10.55041. If an article’s address changes, the DOI is updated so existing citations still resolve.'] },
      { heading: 'Backups', paragraphs: ['The publisher keeps regular, versioned backups of article files and metadata in separate locations. Final PDFs and XML-ready metadata are retained for the life of the journal.'] },
      { heading: 'Your own copy', paragraphs: ['Because articles are CC BY 4.0, authors and institutions may also store copies in repositories. We encourage depositing the final PDF in your institutional repository.'] },
      { heading: 'If the journal ceases publication', paragraphs: ['The publisher will make the article files and metadata available through an open repository and keep DOIs resolving.'] },
    ], ['open-access', 'data', 'corrections']),

  P('author-guidelines', 'Author Guidelines',
    'Follow these steps before you submit so your paper goes to review quickly.',
    [
      { heading: 'Article types', list: ['Research Article: original work, usually 4,000 to 8,000 words.', 'Review Article: a critical, well-structured survey of a field.', 'Short Communication: a concise report of preliminary or focused results, up to 3,000 words.', 'Editorial: by invitation of the editor-in-chief.'] },
      { heading: 'Preparing the manuscript', list: ['Use the journal Word template; write in clear English.', 'Include a title, abstract of 150 to 250 words, three to eight keywords, and a structured body.', 'Number references consistently in the style shown in the template and give DOIs where available.', 'Add author details with affiliations and, if available, ORCID iDs.'] },
      { heading: 'Declarations', paragraphs: ['Include statements on funding, conflicts of interest, ethics approval (where relevant), data availability and any AI tools used.'] },
      { heading: 'Before you click submit', list: ['Check that figures are readable and tables are editable.', 'Make sure all authors have agreed to the submission.', 'Have your files ready: manuscript (Word format) and any supplementary files.'] },
    ], ['submission-process', 'templates', 'ai-policy'],
    { blocks: [{ type: 'downloads', title: 'Templates and checklists', items: [
      { name: 'Manuscript template', desc: 'Headings, tables and reference style ready to fill in.', format: 'DOCX' },
      { name: 'Cover letter template', desc: 'A short structure that helps editors understand your work.', format: 'DOCX' },
      { name: 'Pre-submission checklist', desc: 'One page to tick through before you upload.', format: 'PDF' },
    ] }] }),

  P('reviewer-guidelines', 'Reviewer Guidelines',
    'Reviewers are the backbone of the journal. These guidelines explain what we ask of you.',
    [
      { heading: 'Before you accept', list: ['Check that the topic is within your expertise and you can finish within the agreed time (usually 14 days).', 'Decline if you have a conflict of interest.', 'Do not share the manuscript or use its ideas before publication.'] },
      { heading: 'Writing the report', list: ['Summarise the paper’s claim in a few lines so the editor sees how you read it.', 'Assess originality, soundness of methods, support for conclusions and clarity.', 'Separate major concerns from minor ones and be specific, with page or section references.', 'Be courteous: criticise the work, not the authors.'] },
      { heading: 'Recommendation', paragraphs: ['Choose accept, minor revision, major revision or reject. Add confidential comments for the editor if needed; they are not sent to the authors.'] },
      { heading: 'Recognition', paragraphs: ['Reviewers receive a certificate for each completed review and may be invited to join the review board.'] },
    ], ['peer-review', 'conflict-of-interest', 'become-a-reviewer']),

  P('editorial-policy', 'Editorial Policy',
    'Editors are responsible for what the journal publishes. These principles keep their decisions independent and consistent.',
    [
      { heading: 'Decisions on merit', paragraphs: ['Acceptance depends on originality, rigour and relevance to readers, not on the author’s identity, institution or ability to pay. The APC is requested only after acceptance.'] },
      { heading: 'Roles', list: ['The Editor-in-Chief sets scope and is accountable for the journal’s standards.', 'The Managing Editor oversees workflow, timelines and communication.', 'Associate Editors handle papers in their field and recommend decisions.', 'The Editorial and Review Boards advise on policy and review submissions.'] },
      { heading: 'Confidentiality', paragraphs: ['Editors do not discuss unpublished manuscripts outside the editorial team and do not use information from them for their own work.'] },
      { heading: 'Appeals', paragraphs: ['Authors who disagree with a decision may appeal once with new evidence or a clear explanation of a procedural fault. See the Complaints and Appeals policy.'] },
    ], ['peer-review', 'complaints', 'conflict-of-interest']),

  P('publication-charges', 'Publication Charges',
    'JIMRT charges one article processing charge (APC), and only after your paper is accepted. There are no submission or page fees.',
    [
      { heading: 'Charges', list: ['Authors in India: ₹6,000 plus 18% GST (₹7,080 in total).', 'Authors outside India: US$110, with no GST.', 'There is no fee for submission, peer review, colour figures or extra pages.'] },
      { heading: 'What the APC covers', paragraphs: ['Editorial handling, production of the web and PDF versions, Crossref DOI registration, long-term hosting and author certificates with QR verification.'] },
      { heading: 'Waivers', paragraphs: ['Authors without funding, especially from low-income countries, can request a waiver or discount with their submission. Requests are decided by the editor-in-chief independently of the review outcome.'] },
    ], ['apc-payment', 'refund', 'open-access'],
    { blocks: [{ type: 'faq', title: 'Charges FAQ', items: [
      { q: 'Is GST charged?', a: 'GST at 18% applies only to authors in India, and a GST invoice is issued after payment is confirmed.' },
      { q: 'Does paying improve my chances?', a: 'No. The decision is made before any payment is requested.' },
      { q: 'Who is billed if there are several authors?', a: 'One invoice is issued, in the name and details you supply at payment.' },
    ] }] }),

  P('refund', 'Refund Policy',
    'Refunds are available in limited, clearly defined situations.',
    [
      { heading: 'Eligible cases', list: ['The APC was paid twice for the same paper.', 'The journal could not publish the paper after payment for reasons on its side.', 'You were charged an amount different from the one stated on the invoice.'] },
      { heading: 'Not eligible', list: ['Withdrawal after the article has been published.', 'Change of mind about the journal once production has started.', 'Foreign bank or currency-conversion charges.'] },
      { heading: 'How to ask', paragraphs: ['Write to editor@jimrt.org within 30 days of payment with the Paper ID and payment reference. Approved refunds are returned to the original payment method within 10 working days.'] },
    ], ['publication-charges', 'apc-payment', 'complaints']),

  P('complaints', 'Complaints and Appeals',
    'If you believe the journal made a mistake or treated you unfairly, you can ask for a review.',
    [
      { heading: 'Complaints', paragraphs: ['Write to editor@jimrt.org or use the contact form with your Paper ID if you have one. Describe what happened and what outcome you want. We acknowledge your message within two working days.'] },
      { heading: 'Appeals against a decision', paragraphs: ['An appeal must explain why the decision is wrong, for example a factual error by a reviewer or a conflict of interest. The editor-in-chief, or another board member when the chief is involved, examines it and may ask for a further opinion. Disagreement alone is not grounds for appeal.'] },
      { heading: 'Outcome', paragraphs: ['You receive a written answer, normally within four weeks. The decision on an appeal is final for that submission.'] },
    ], ['editorial-policy', 'publication-ethics', 'refund']),

  P('data', 'Data Policy',
    'Sharing data lets others check and build on research. We encourage it and ask for a clear statement in every paper.',
    [
      { heading: 'Data availability statement', paragraphs: ['Each article must include a statement saying where the underlying data can be found, or why it cannot be shared (for example privacy or legal limits).'] },
      { heading: 'Good practice', list: ['Deposit data in a trusted public repository and cite it with a DOI or persistent link.', 'Share code needed to reproduce the results where possible.', 'Anonymise data about people so that individuals cannot be identified.'] },
      { heading: 'Reviewer access', paragraphs: ['Editors may ask for data or code during review. Failure to provide it without good reason can lead to rejection.'] },
    ], ['author-guidelines', 'privacy', 'archiving']),

  // ---------------- For authors ----------------
  A('submission-process', 'Submission Process',
    'Submitting takes about ten minutes. No account is needed: you receive a Paper ID such as JIMRT2026000045 immediately.',
    [
      { heading: 'Before you start', list: ['Read the Author Guidelines and prepare your manuscript in the template.', 'Have the names, emails and affiliations of all authors ready.', 'Keep your manuscript as a Word file; add supplementary files if needed.'] },
      { heading: 'After submission', paragraphs: ['Your Paper ID is shown on screen and emailed to you. Use it with your email on the Track My Paper page to see the current stage, download letters and pay the APC once your paper is accepted.'] },
    ], ['author-guidelines', 'templates', 'apc-payment'],
    [{ type: 'steps', title: 'The eight stages of a paper', items: [
      { title: 'Submission', text: 'Fill in the form and upload your manuscript. A Paper ID is issued at once.' },
      { title: 'Review', text: 'An editor screens the paper, and expert reviewers assess it if it fits the journal.' },
      { title: 'Decision', text: 'You receive the decision with the editor’s reasons: accept, revise or reject.' },
      { title: 'Acceptance', text: 'You get an acceptance letter and a publishing agreement to sign.' },
      { title: 'Payment', text: 'Pay the APC online. International authors pay no GST; Indian authors receive a GST invoice.' },
      { title: 'Production', text: 'Your article is typeset and the metadata checked. You approve the final proof.' },
      { title: 'Publication', text: 'The article goes live with its DOI, and author certificates are issued.' },
      { title: 'Indexing', text: 'We watch for the article in Google Scholar and tell you when it appears.' },
    ] }]),

  A('templates', 'Article Templates',
    'Use the official files to format your manuscript and to write a clear cover letter.',
    [
      { heading: 'How to use them', list: ['Copy your text into the manuscript template instead of changing its styles.', 'Keep headings to three levels and place tables and figures where they are first mentioned.', 'Use the cover letter to explain what is new about your work and suggest suitable reviewers.'] },
    ], ['author-guidelines', 'submission-process'],
    [{ type: 'downloads', title: 'Download templates', items: [
      { name: 'Manuscript template', desc: 'For research articles, reviews and short communications.', format: 'DOCX' },
      { name: 'Cover letter template', desc: 'Tell the editor why your paper belongs in JIMRT.', format: 'DOCX' },
      { name: 'Response to reviewers', desc: 'A point-by-point layout for revisions.', format: 'DOCX' },
    ] }]),

  A('apc-payment', 'APC & Payment',
    'One article processing charge, payable only after acceptance.',
    [
      { heading: 'Amounts', list: ['India: ₹6,000 + 18% GST = ₹7,080.', 'Outside India: US$110 (no GST).'] },
      { heading: 'How to pay', paragraphs: ['Open Track My Paper, enter your Paper ID and email, and choose Pay APC. If you pay by bank transfer or UPI, upload the proof and the editorial office confirms it, usually within two working days. A receipt or GST invoice follows.'], callout: { tone: 'info', title: 'Nothing is due at submission', text: 'You will never be asked to pay before the editor has accepted your paper.' } },
    ], ['publication-charges', 'refund'],
    [{ type: 'faq', title: 'Payment FAQ', items: [
      { q: 'When do I pay?', a: 'Only after acceptance. Nothing is charged at submission or during review.' },
      { q: 'Which methods work?', a: 'UPI, cards and net banking for Indian authors, and international cards or bank transfer for others.' },
      { q: 'Can I get a waiver?', a: 'Yes. Request one with your submission; the editor-in-chief decides separately from the review.' },
      { q: 'Can I get a refund?', a: 'Refunds apply to duplicate payments or if the paper cannot be published. See the Refund Policy.' },
    ] }]),

  A('become-a-reviewer', 'Become a Reviewer',
    'Editors invite reviewers when a paper needs specialist input. If you hold a PhD or equivalent experience, we would like to hear from you.',
    [
      { heading: 'What we offer', list: ['A certificate for every completed review.', 'Early sight of new research in your field.', 'A route to the review board for consistent contributors.'] },
      { heading: 'What we ask', paragraphs: ['Reviews are expected within 14 days, are confidential and must follow the Reviewer Guidelines. Invitations arrive only for papers that match your stated expertise.'] },
    ], ['reviewer-guidelines', 'peer-review'],
    [{ type: 'reviewer-form', title: 'Reviewer application' }]),

  // ---------------- About ----------------
  B('journal-information', 'Journal Information',
    'The official record of the journal: title, identifiers, publisher and how to reach the editorial office.',
    [{ heading: 'Overview', paragraphs: [`${NAME} is a monthly, peer-reviewed open access journal. It publishes original research across disciplines, with an emphasis on work that links fields or turns research into practical technology.`] }],
    ['aims-scope', 'indexing', 'contact'],
    [{ type: 'journal-info' }]),

  B('aims-scope', 'Aims & Scope',
    'JIMRT exists to give good research from any field a fast, fair and permanently open home.',
    [
      { heading: 'Aims', list: ['Publish sound, original work without barriers to readers.', 'Support work that crosses disciplines.', 'Give authors a clear, trackable path from submission to a citable DOI.'] },
      { heading: 'Types of work', paragraphs: ['We publish research articles, review articles and short communications. Replication studies, negative results and well-documented technical reports are welcome.'] },
    ], ['indexing', 'contact', 'author-guidelines'],
    [{ type: 'icon-grid', title: 'Subject areas', items: [
      { icon: 'engineering', title: 'Engineering & Technology', text: 'Civil, mechanical, electrical and emerging technologies.' },
      { icon: 'computing', title: 'Computer & Data Science', text: 'Machine learning, software systems, security and data.' },
      { icon: 'life', title: 'Life & Health Sciences', text: 'Biology, medicine, public health and biotechnology.' },
      { icon: 'environment', title: 'Environment & Sustainability', text: 'Climate, water, energy transition and ecology.' },
      { icon: 'physical', title: 'Physical Sciences & Materials', text: 'Physics, chemistry and advanced materials.' },
      { icon: 'social', title: 'Social Sciences & Education', text: 'Learning, policy, society and behaviour.' },
      { icon: 'business', title: 'Business & Economics', text: 'Management, finance, markets and innovation.' },
      { icon: 'agriculture', title: 'Agriculture & Food', text: 'Crops, soil, food systems and agri-technology.' },
    ] }]),

  B('indexing', 'Indexing & Abstracting',
    'How JIMRT articles are registered and made findable. We list only services we can currently confirm.',
    [
      { heading: 'What is in place', list: ['Crossref: every article has a registered DOI under 10.55041.', 'Google Scholar: article pages carry Scholar-compatible metadata and we check for indexing regularly.'] },
      { heading: 'A note on accuracy', paragraphs: ['JIMRT is a new journal. We add a service to this page only after the listing exists, and we do not state impact factors or database coverage that we do not hold.'] },
    ], ['aims-scope', 'contact', 'archiving'],
    [{ type: 'indexing-grid', title: 'Current listings' }]),

  B('contact', 'Contact',
    'The editorial office replies within two working days.',
    [{ heading: 'Before you write', paragraphs: ['For anything about a submission, include your Paper ID. For payment questions, include the payment reference.'] }],
    ['aims-scope', 'complaints', 'publication-ethics'],
    [{ type: 'contact-details' }, { type: 'contact-form', title: 'Send us a message' }]),
]

export const pageBySlug = (slug: string) => staticPages.find((p) => p.slug === slug)
