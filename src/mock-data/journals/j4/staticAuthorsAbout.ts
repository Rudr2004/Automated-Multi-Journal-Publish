// Journal 4 (IJECM) for-authors and about pages. Only Crossref and Google Scholar are listed under indexing.
import type { StaticPageData } from '../../../core/types'
import { A, B, NAME } from './staticHelpers'

export const authorsAbout: StaticPageData[] = [
  A('submission-process', 'Submission Process',
    'Eight stages take a paper from your first upload to a published, citable article. You can follow each stage online with your Paper ID.',
    [
      { heading: 'Before you start', list: ['Prepare the manuscript with the official template and gather permissions for third-party figures.', 'Have the names, affiliations and email addresses of all authors ready.', 'Keep your abstract, keywords and declarations to hand; the form asks for them.'] },
      { heading: 'After you submit', paragraphs: ['You receive a Paper ID such as IJECM2026000112 and a confirmation email. Use that ID with your email address on the Track My Paper page at any time to see where your paper is, read the editor’s reasons and complete any step that needs you.'] },
    ], ['author-guidelines', 'templates', 'apc-payment'],
    [{ type: 'steps', title: 'The eight stages', items: [
      { title: 'Submission', text: 'Upload the manuscript and declarations. You receive your Paper ID.' },
      { title: 'Review', text: 'An editor checks the paper, then expert reviewers assess it.' },
      { title: 'Decision', text: 'You receive accept, revise or reject, with written reasons.' },
      { title: 'Acceptance', text: 'You receive an acceptance letter and a short publishing agreement.' },
      { title: 'Payment', text: 'Pay the APC online. Indian authors get a GST invoice; others pay no GST.' },
      { title: 'Production', text: 'We typeset the article, check equations and metadata, and ask you to approve the proof.' },
      { title: 'Publication', text: 'The article goes live with its Crossref DOI and your certificate is issued.' },
      { title: 'Discovery', text: 'We watch for the article in Google Scholar and tell you when it appears.' },
    ] }]),

  A('templates', 'Article Templates',
    'Start from our files to format the manuscript and to write a clear cover letter.',
    [
      { heading: 'How to use them', list: ['Paste your text into the manuscript template instead of changing its styles.', 'Keep headings to three levels and give every figure and table a caption and credit.', 'Use the cover letter to say what is new and who the work is for.'] },
      { heading: 'Revising after review', paragraphs: ['If the editor asks for changes, answer each reviewer comment in the response template: quote the comment, then say what you changed or why you did not. Highlight changes in the manuscript so the editor can see them.'] },
    ], ['author-guidelines', 'submission-process'],
    [{ type: 'downloads', title: 'Download templates', items: [
      { name: 'Manuscript template', desc: 'For research articles, reviews and short communications, with equation and unit styles.', format: 'DOCX' },
      { name: 'Cover letter template', desc: 'Explain why your paper belongs in IJECM.', format: 'DOCX' },
      { name: 'Response to reviewers', desc: 'A point-by-point layout for revisions.', format: 'DOCX' },
      { name: 'Figure permission form', desc: 'A simple release for third-party figures and photographs.', format: 'DOCX' },
    ] }]),

  A('apc-payment', 'APC & Payment',
    'One article processing charge, payable only after acceptance.',
    [
      { heading: 'Amounts', list: ['India: ₹6,000 + 18% GST (₹1,080) = ₹7,080.', 'Outside India: US$110 (no GST).'] },
      { heading: 'How to pay', paragraphs: ['Open Track My Paper, enter your Paper ID and email, and choose Pay APC. If you pay by bank transfer or UPI, upload the proof; the editorial office confirms it, usually within two working days. A receipt, or a GST invoice for Indian authors, is issued on confirmation.'] },
      { heading: 'Good to know', paragraphs: ['Nothing is charged at submission or during review. If you need a waiver, request it with your submission rather than after acceptance.'] },
    ], ['publication-charges', 'refund'],
    [{ type: 'faq', title: 'Payment FAQ', items: [
      { q: 'When do I pay?', a: 'Only after acceptance. Nothing is due at submission or during peer review.' },
      { q: 'Which methods work?', a: 'UPI, cards and net banking for Indian authors, and international cards or bank transfer for others.' },
      { q: 'Can I get a waiver?', a: 'Yes. Request one with your submission. The editor-in-chief decides separately from the review.' },
      { q: 'Can I get a refund?', a: 'Refunds apply to duplicate payments or when we cannot publish. See the Refund Policy.' },
    ] }]),

  A('become-a-reviewer', 'Become a Reviewer',
    'Editors invite reviewers when a paper needs specialist input. If you have research or professional expertise in engineering or its management, we would like to hear from you.',
    [
      { heading: 'What you receive', list: ['A certificate for every completed review.', 'Early sight of new research in your field.', 'A route to the review board for consistent contributors.'] },
      { heading: 'What we ask', paragraphs: ['Reviews are expected within 14 days and must follow the Reviewer Guidelines. Reviews are confidential, and you will be asked only about papers that match the expertise you list. Practising engineers and managers with publication experience are welcome to apply alongside academics.'] },
    ], ['reviewer-guidelines', 'peer-review'],
    [{ type: 'reviewer-form', title: 'Reviewer application' }]),

  B('journal-information', 'Journal Information',
    'The official record of the journal: title, identifiers, publisher and how to reach the editorial office.',
    [{ heading: 'Overview', paragraphs: [`${NAME} is a monthly, peer-reviewed open access journal. It publishes research and case-based work that connects engineering concepts with the management of projects, operations and infrastructure.`] }],
    ['aims-scope', 'indexing', 'contact'],
    [{ type: 'journal-info' }]),

  B('aims-scope', 'Aims & Scope',
    'IJECM gives engineering research and engineering management a fast, fair and permanently open home.',
    [
      { heading: 'Aims', list: ['Publish sound, original work on engineering concepts and their management, free for every reader.', 'Support research that crosses technical disciplines and the management of projects, operations and assets.', 'Give authors a clear, trackable path to a citable DOI.'] },
      { heading: 'Methods we welcome', paragraphs: ['We welcome experimental and field studies, numerical and analytical modelling, design and optimisation, data-driven and machine-learning methods, survey and case-based management research, and systematic reviews. Papers should report validation, limits and uncertainty plainly.'] },
      { heading: 'Types of work', paragraphs: ['We publish research articles, review articles, case studies, short communications and editorials. Replication studies and well-documented project reports are considered on their merits.'] },
    ], ['indexing', 'contact', 'author-guidelines'],
    [{ type: 'icon-grid', title: 'Our nine research areas', items: [
      { icon: 'civil', title: 'Civil & Structural', text: 'Structures, materials, geotechnics, seismic design and construction.' },
      { icon: 'mechanical', title: 'Mechanical & Manufacturing', text: 'Machine design, thermal systems, machining and additive processes.' },
      { icon: 'electrical', title: 'Electrical & Power', text: 'Power systems, microgrids, machines, protection and storage.' },
      { icon: 'electronics', title: 'Electronics & Embedded', text: 'Circuits, sensing, instrumentation and embedded platforms.' },
      { icon: 'computing', title: 'Computer & Control', text: 'Control theory, automation, signal processing and engineering software.' },
      { icon: 'industrial', title: 'Industrial & Systems', text: 'Production planning, quality, human factors and simulation.' },
      { icon: 'operations', title: 'Operations & Supply Chain', text: 'Inventory, logistics, scheduling and supply chain resilience.' },
      { icon: 'project', title: 'Project & Engineering Management', text: 'Risk, cost, schedule, contracts and engineering teams.' },
      { icon: 'infrastructure', title: 'Smart & Sustainable Infrastructure', text: 'Monitoring, resilience, lifecycle assessment and low-carbon design.' },
    ] }]),

  B('indexing', 'Indexing & Abstracting',
    'How IJECM articles are registered and made findable. We list only the services we can confirm today.',
    [
      { heading: 'What is in place', list: ['Crossref: every article has a registered DOI under the prefix 10.55041.', 'Google Scholar: article pages carry Scholar-compatible metadata, and we check regularly that new papers appear.'] },
      { heading: 'A note on accuracy', paragraphs: ['IJECM is a new journal. We add a service to this page only after the listing exists, and we do not state impact factors, rankings or database coverage that we do not hold. Use the verify links below to check a listing on the service’s own website.'] },
    ], ['aims-scope', 'contact', 'archiving'],
    [{ type: 'indexing-grid', title: 'Current listings' }]),

  B('contact', 'Contact',
    'The editorial office replies within two working days.',
    [{ heading: 'Before you write', paragraphs: ['For anything about a submission, include your Paper ID. For payment questions, include the payment reference. For a concern about ethics, use the form or write to the editor-in-chief through the editorial office.'] }],
    ['aims-scope', 'complaints', 'publication-ethics'],
    [{ type: 'contact-details' }, { type: 'contact-form', title: 'Send us a message' }]),
]
