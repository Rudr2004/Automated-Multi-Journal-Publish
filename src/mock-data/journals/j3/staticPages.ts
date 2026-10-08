// Journal 3 (IJCSD) static pages: policies, for authors and about. Original text for this journal only.
// Facts mirror src/config/journals/j3.ts (ISSN, DOI prefix and domain are marked "client to confirm" there).
// Memberships, indexing and review models the journal does not hold are never claimed: only Crossref and Google Scholar are listed,
// COPE is a reference point (not a membership) and peer review is single-anonymised (reviewers know the authors; authors do not know the reviewers).
import type { StaticBlock, StaticPageData, StaticSection } from '../../../core/types'

const UPDATED = '2026-10-01'
const NAME = 'International Journal of Creative Studies and Development (IJCSD)'

const P = (slug: string, title: string, intro: string, sections: StaticSection[], related: string[], extra: Partial<StaticPageData> = {}): StaticPageData =>
  ({ slug, group: 'policies', title, intro, sections, updated: UPDATED, related, ...extra })
const A = (slug: string, title: string, intro: string, sections: StaticSection[], related: string[], blocks?: StaticBlock[]): StaticPageData =>
  ({ slug, group: 'for-authors', title, intro, sections, updated: UPDATED, related, blocks })
const B = (slug: string, title: string, intro: string, sections: StaticSection[], related: string[], blocks?: StaticBlock[]): StaticPageData =>
  ({ slug, group: 'about', title, intro, sections, updated: UPDATED, related, blocks })

export const staticPages: StaticPageData[] = [
  // ---------------- Policies ----------------
  P('publication-ethics', 'Publication Ethics',
    `Creative research often draws on people’s stories, images, songs and heritage. ${NAME} asks authors, reviewers and editors to treat that material, and each other, with care.`,
    [
      { heading: 'The standards we follow', paragraphs: ['Our practice is guided by COPE-aligned good-practice principles. IJCSD is not a COPE member; we use those widely shared principles as a reference for how we behave and how we deal with problems when they arise.'], list: ['Work must be original, honestly reported and supported by material the authors can show on request.', 'Authorship is limited to people who made a substantial contribution and who approve the final text.', 'Editorial decisions rest on the quality and fit of the work, never on an author’s nationality, gender, belief, institution or ability to pay.', 'Reviewers treat manuscripts as confidential and declare any conflict before they accept an invitation.'] },
      { heading: 'Working with communities and cultural heritage', paragraphs: ['Studies that involve participants, communities or cultural material must describe how consent was sought and what participants were told about publication. Where a study draws on Indigenous or community knowledge, say who holds that knowledge, how the community agreed to its use and how credit or benefit is shared.', 'Images of identifiable people, performances, artworks and museum objects need written permission from the person, artist or rights holder. Editors may ask to see permission letters at any stage, and may decline images that cannot be cleared.'] },
      { heading: 'Duplicate submission and misconduct', paragraphs: ['Submitting the same work to more than one journal at the same time is not allowed. Fabricated data, invented quotations, undisclosed re-use of one’s own published text and manipulated images are treated as misconduct. We investigate concerns in confidence, give authors a chance to respond, and may correct, retract or notify the author’s institution.'], callout: { tone: 'info', title: 'Raise a concern', text: 'Write to the editorial office with the Paper ID or DOI and the reason for your concern. We acknowledge every concern within two working days.' } },
    ], ['plagiarism', 'conflict-of-interest', 'retraction'], { principles: true }),

  P('peer-review', 'Peer Review Process',
    'Every submission goes through the same path: an editor’s check, expert review and a decision that comes with written reasons.',
    [
      { heading: 'How review works', paragraphs: ['IJCSD uses single-anonymised peer review. Reviewers can see who wrote the paper; authors are not told who reviewed it. Reviewers are chosen for their familiarity with the topic and the method, whether that is practice-based work, ethnography, archival research or audience studies.'], list: ['An editor first checks scope, completeness, ethics statements and similarity-screening results.', 'Papers that fit are sent to at least two reviewers, with a target of 14 days for the first decision.', 'The handling editor weighs the reports and chooses accept, minor revision, major revision or reject.'] },
      { heading: 'Reviewing practice-based and non-traditional work', paragraphs: ['Where a submission includes a creative work, an exhibition, a performance or a design artefact, reviewers are asked to judge the written account and the documentation provided. Authors should supply images, links or recordings that let a reviewer understand the work without attending it.'] },
      { heading: 'Decisions and appeals', paragraphs: ['Every decision includes the reviewers’ comments or the editor’s reasons. Authors who think a decision rested on a factual error can appeal once, within 30 days, as described in the Complaints and Appeals page. An appeal is handled by an editor who was not involved in the original decision whenever possible.'] },
    ], ['reviewer-guidelines', 'editorial-policy', 'complaints'],
    { blocks: [{ type: 'flow', title: 'From submission to decision', nodes: [
      { label: 'Submit', note: 'You receive a Paper ID' }, { label: 'Editor check', note: 'Scope and ethics' }, { label: 'Reviewers', note: 'At least two' },
      { label: 'Reports', note: 'Target 14 days' }, { label: 'Decision', note: 'With reasons' }, { label: 'Revision', note: 'If asked' },
    ] }] }),

  P('copyright-licensing', 'Copyright and Licensing',
    'Authors keep the copyright in their work. Readers may reuse it, with credit, under a Creative Commons licence.',
    [
      { heading: 'What the licence allows', paragraphs: ['All articles are published under CC BY 4.0. Anyone may copy, share, translate, adapt and build on an article, including commercially, as long as they credit the authors, link to the licence and say whether changes were made.'] },
      { heading: 'Third-party material', paragraphs: ['The licence covers your words and your own figures. It does not cover material that belongs to someone else, such as a photograph by another photographer, a film still, an artwork, a score or a museum image. For each item, either obtain permission to publish it under CC BY 4.0 or state clearly in the caption that it is used with permission and is excluded from the licence.'], list: ['Keep written permissions; the editor may ask for them.', 'Give the rights holder’s name and the source in the caption.', 'Replace images that cannot be cleared with a description or a drawing.'] },
      { heading: 'Your agreement with us', paragraphs: ['On acceptance you sign a short publishing agreement. It confirms that you hold the rights to what you submit and that you grant IJCSD permission to publish the article under CC BY 4.0. You may deposit your published article in a repository, or post it on your own site, at any time.'] },
    ], ['open-access', 'plagiarism', 'archiving']),

  P('open-access', 'Open Access Policy',
    'IJCSD is free to read. Readers never meet a paywall, a login or a subscription.',
    [
      { heading: 'What open access means here', paragraphs: ['Every article is available in full on the journal website from the day it appears, with no registration. Authors pay a one-time article processing charge only after their paper has been accepted; the charge is what keeps reading free.'] },
      { heading: 'Reuse and sharing', paragraphs: ['Because articles carry the CC BY 4.0 licence, teachers can build reading lists, museums can quote in exhibition texts and community groups can translate articles for their members, as long as they credit the authors.'] },
      { heading: 'Funding and waivers', paragraphs: ['Funding should never decide who is heard. Authors who cannot meet the charge, particularly early-career researchers, independent practitioners and those in low-income settings, may request a waiver or partial waiver when they submit. The request is decided separately from peer review and does not affect the editorial decision.'] },
    ], ['copyright-licensing', 'publication-charges', 'archiving']),

  P('privacy', 'Privacy Policy',
    'What personal information the journal collects, why we collect it and how long we keep it.',
    [
      { heading: 'What we collect', list: ['Authors: name, email address, institution, country, ORCID iD if provided, and the manuscript and related files.', 'Reviewers and editors: contact details, areas of expertise and a record of reviews completed.', 'People who write to us or subscribe to alerts: the details they enter in the form.', 'Visitors: basic technical data such as pages visited, used in aggregate to improve the site.'] },
      { heading: 'How we use it', paragraphs: ['We use personal data to run peer review, communicate about submissions, issue invoices and certificates, register DOIs with Crossref and keep a record of editorial decisions. We do not sell personal data. We share it only with people and services needed to publish your work, such as a reviewer who receives the manuscript or a payment processor.'] },
      { heading: 'Your choices', paragraphs: ['You can ask us to show, correct or delete personal data we hold, subject to records we are required or need to keep, for example the authorship and date of a published article. Published articles and their author names remain public. Write to the editorial office to make a request; we respond within 30 days and handle data in line with the data protection law that applies in India.'] },
    ], ['data', 'publication-ethics', 'complaints']),

  P('plagiarism', 'Plagiarism Policy',
    'Credit what you borrow. Every submission is screened for overlap with earlier work.',
    [
      { heading: 'What counts as plagiarism', list: ['Copying text, images, music, design layouts or ideas from others without credit.', 'Close paraphrase that follows another source’s structure without attribution.', 'Re-using your own earlier published text without saying so (text recycling).', 'Presenting community or Indigenous knowledge as your own discovery without acknowledging its holders.'] },
      { heading: 'How we check', paragraphs: ['Submissions are run through similarity-screening software, and the editor reads the report rather than relying on a percentage. Quoted passages, reference lists and standard method descriptions are expected to match; unexplained overlap with a single source is not.'] },
      { heading: 'What happens next', paragraphs: ['Minor overlap is returned to the author for rewriting. Substantial or deliberate copying leads to rejection and, for published papers, correction or retraction. Serious cases may be reported to the author’s institution. Authors are always invited to explain before a decision is made.'] },
    ], ['publication-ethics', 'retraction', 'ai-policy']),

  P('ai-policy', 'AI Policy',
    'Generative tools are common in creative practice. This page explains what is allowed in a manuscript, in review and in the images you send us.',
    [
      { heading: 'For authors', paragraphs: ['AI tools may support language editing, translation or code, but they cannot be listed as authors, because they cannot take responsibility for a work. If you use a generative tool for text, analysis or images in your paper, say so in the Methods or Acknowledgements, naming the tool, the version and what it was used for. You remain responsible for accuracy, references and the rights in anything the tool produced.'] },
      { heading: 'AI-generated images and creative work', paragraphs: ['When AI-generated imagery is itself the object of study, label each figure clearly as AI-generated and describe the prompts or process. We do not publish AI-generated images presented as photographs, field records or archival material, and invented quotations or references are treated as fabrication.'] },
      { heading: 'For reviewers and editors', paragraphs: ['Manuscripts are confidential. Reviewers and editors must not upload a manuscript, or parts of one, to a public AI service. Tools may be used privately to polish the wording of your own report, but the judgement in it must be yours.'] },
    ], ['plagiarism', 'publication-ethics', 'author-guidelines']),

  P('conflict-of-interest', 'Conflict of Interest',
    'A conflict is not a wrongdoing. Hiding one is a problem. Tell us, and we will manage it.',
    [
      { heading: 'What to declare', list: ['Financial ties, such as funding, consultancy, commissions or ownership of a company or gallery connected to the work.', 'Personal or professional relationships with the people or organisations studied, including supervisor, collaborator or family links.', 'Competing intellectual interests, such as a rival exhibition, project or theory.'] },
      { heading: 'Authors', paragraphs: ['Include a conflict statement in the manuscript, even if it says that you have none. Practice-based researchers should mention when they created, performed or curated the work they analyse.'] },
      { heading: 'Reviewers and editors', paragraphs: ['Decline to review a paper from a recent collaborator, a colleague at your institution or a competitor. Editors do not handle papers from their own institution or co-authors; those are passed to another editor, and the declaration is recorded.'] },
    ], ['publication-ethics', 'editorial-policy', 'reviewer-guidelines']),

  P('retraction', 'Retraction Policy',
    'Retraction is a last resort for articles that cannot be relied on. When we do it, we do it openly.',
    [
      { heading: 'When we retract', list: ['Evidence of fabricated or manipulated data, quotations or images.', 'Serious plagiarism, or publication without the necessary permissions or consent.', 'Duplicate publication, or an honest error so serious that the conclusions no longer hold.'] },
      { heading: 'How we retract', paragraphs: ['The article stays online, marked clearly as retracted, with a notice that states the reason, who requested it and the date. Retraction notices are linked to the article and to its DOI metadata. We do not delete retracted papers, so that the record stays complete.'] },
      { heading: 'Before a decision', paragraphs: ['The editor-in-chief reviews the evidence, invites the authors to reply and may consult independent experts. Where an error is fixable, a correction is preferred. See Corrections and Errata.'] },
    ], ['corrections', 'publication-ethics', 'complaints']),

  P('corrections', 'Corrections and Errata',
    'Mistakes happen. When one is found after publication, we fix it in public.',
    [
      { heading: 'Types of correction', list: ['Erratum: an error made by the journal, such as a wrong figure or missing author.', 'Corrigendum: an error made by the authors that affects the meaning or the credit.', 'Minor typographical changes that do not affect understanding may be made quietly, with a note in the article history.'] },
      { heading: 'How to ask for one', paragraphs: ['Write to the editorial office with the DOI, what is wrong and what it should say. Corrections affecting authorship, permissions or conclusions need the agreement of every author.'] },
      { heading: 'How corrections appear', paragraphs: ['The corrected article carries a visible notice linking to the correction, which is published with its own record. The original version stays available in the article history.'] },
    ], ['retraction', 'publication-ethics', 'author-guidelines']),

  P('archiving', 'Archiving Policy',
    'Articles should stay findable and readable for the long term. This page explains what we do and what we do not yet do.',
    [
      { heading: 'Permanent identifiers', paragraphs: ['Each article receives a DOI under the prefix 10.55041, registered with Crossref. If the web address of an article ever changes, the DOI is updated to point to the new location, so existing citations keep working.'] },
      { heading: 'Preservation', paragraphs: ['The publisher keeps secure, regularly tested backups of all published articles, files and metadata. IJCSD does not currently take part in a third-party preservation service; this page will be updated if that changes.'] },
      { heading: 'Author deposit', paragraphs: ['Authors are encouraged to place the published PDF in an institutional or subject repository and to link it to the DOI. The CC BY 4.0 licence permits this without asking permission.'] },
    ], ['open-access', 'copyright-licensing', 'data']),

  P('author-guidelines', 'Author Guidelines',
    'Everything you need before you submit: what we publish, how to prepare the manuscript and what to declare.',
    [
      { heading: 'What we publish', paragraphs: ['IJCSD publishes research articles, review articles, short communications and editorials in English. Subjects fall under our eight themes: design and visual culture, arts and education, media and communication, cultural heritage and museums, creative industries, digital creativity, development studies, and performing arts and music.'], list: ['Research articles: original studies, typically 5,000 to 8,000 words.', 'Review articles: critical syntheses of a body of work.', 'Short communications: brief reports of case studies, projects or early findings.'] },
      { heading: 'Preparing the manuscript', list: ['Use the manuscript template and keep headings to three levels.', 'Add a structured abstract of up to 250 words and 4 to 8 keywords.', 'Describe your method plainly, for example practice-based, ethnographic, archival, participatory or audience research, and say how you chose participants or sources.', 'Place figures and tables where they are first mentioned, with captions and credits. Provide images at readable resolution and add alternative text for each.', 'Cite sources in a consistent style and give a DOI or link wherever one exists.'] },
      { heading: 'Declarations', paragraphs: ['At submission you confirm that the work is original and not under review elsewhere, that all authors approve it, and that you have the permissions for images and participant material. Add statements on ethics approval or consent, funding, conflicts of interest, data availability and any use of AI tools.'], callout: { tone: 'info', title: 'Before you press submit', text: 'Check names, affiliations and email addresses carefully. Authorship changes after acceptance require the written agreement of every author.' } },
    ], ['submission-process', 'templates', 'ai-policy'],
    { blocks: [{ type: 'faq', title: 'Common questions', items: [
      { q: 'Can I submit a creative work such as a film or exhibition?', a: 'We publish research about creative practice. Submit a written article with documentation, such as images, links or recordings, so that reviewers can understand the work.' },
      { q: 'Is there a word limit?', a: 'Research articles usually run 5,000 to 8,000 words including references. Short communications are up to 3,000 words. Tell the editor in your cover letter if you need more.' },
      { q: 'Do I need ethics approval?', a: 'If people took part, state which body approved the study or explain why approval was not required. Always explain how consent was obtained.' },
      { q: 'Can I submit a preprint?', a: 'Yes. Mention the preprint in your cover letter and link it in the manuscript.' },
    ] }] }),

  P('reviewer-guidelines', 'Reviewer Guidelines',
    'A good review helps the editor decide and helps the author improve. This page sets out what we ask of you.',
    [
      { heading: 'Before you accept', paragraphs: ['Accept only if the topic and method are within your expertise, you can return the report in the time asked, and you have no conflict of interest. If you cannot review, say so quickly and suggest another person if you can.'] },
      { heading: 'Writing the report', list: ['Summarise the argument in a few sentences so the editor knows you understood it.', 'Comment on originality, fit with the journal, soundness of method, use of evidence and clarity of writing.', 'For practice-based and community-based work, comment on how the research process, consent and credit have been handled.', 'Separate comments for the author from confidential remarks for the editor.', 'Be specific and kind. Critique the work, not the person.'] },
      { heading: 'Confidentiality', paragraphs: ['Do not share, discuss or use the manuscript beyond the review. Do not contact the authors directly. If you believe you recognise a problem such as plagiarism or undisclosed overlap, tell the editor.'] },
    ], ['peer-review', 'conflict-of-interest', 'become-a-reviewer']),

  P('editorial-policy', 'Editorial Policy',
    'How editors make decisions and keep them independent of anything but the quality and fit of the work.',
    [
      { heading: 'Independence', paragraphs: ['The editor-in-chief has full authority over what is published. Commercial, institutional or personal interests, including those of the publisher, have no say in a decision, and the ability to pay a charge is never part of the review.'] },
      { heading: 'Roles', paragraphs: ['The editor-in-chief sets direction and handles appeals. The managing editor runs day-to-day operations. Associate editors handle manuscripts in their theme, and the editorial and review boards advise on policy and review papers.'] },
      { heading: 'Fairness and consistency', paragraphs: ['Editors apply the same criteria to every submission, record the reason for each decision and recuse themselves when they have a conflict. Special issues and commissioned pieces go through the same review as other papers.'] },
    ], ['peer-review', 'conflict-of-interest', 'complaints']),

  P('publication-charges', 'Publication Charges',
    'IJCSD charges one article processing charge (APC), payable only after your paper is accepted.',
    [
      { heading: 'The charge', paragraphs: ['The APC covers editorial handling, typesetting, DOI registration, hosting and the author certificate. There is no fee to submit, no charge for peer review and no hidden extras.'], list: ['Authors in India: ₹5,500 plus 18% GST, a total of ₹6,490.', 'Authors elsewhere: US$100, with no GST.'] },
      { heading: 'When you pay', paragraphs: ['You receive an invoice with your acceptance letter. Production starts once payment is confirmed. Payment details are on the APC and Payment page.'] },
      { heading: 'Waivers', paragraphs: ['A waiver or partial waiver can be requested at submission and is decided by the editor-in-chief independently of peer review. Early-career researchers, independent practitioners and authors in low-income settings are especially encouraged to ask.'] },
    ], ['apc-payment', 'refund', 'open-access']),

  P('refund', 'Refund Policy',
    'Refunds are limited, but clear. Here is when they apply.',
    [
      { heading: 'When we refund', list: ['You paid twice for the same paper.', 'The journal cannot publish your paper after you paid, for example because of an editorial or technical failure on our side.', 'A payment was made in error to the wrong paper, and we have not yet started production.'] },
      { heading: 'When we do not', paragraphs: ['Once an article is published, the charge is not refunded. A paper withdrawn by the author after production has begun is not refunded either, as the editorial and typesetting work is already done. A paper retracted for misconduct is not refunded.'] },
      { heading: 'How to ask', paragraphs: ['Write to the editorial office within 30 days of payment with your Paper ID and payment reference. Approved refunds are returned to the original payment method within 14 working days; bank fees may be deducted for international transfers.'] },
    ], ['publication-charges', 'apc-payment', 'complaints']),

  P('complaints', 'Complaints and Appeals',
    'If you think we got something wrong, tell us. We take every complaint seriously and answer it in writing.',
    [
      { heading: 'What you can raise', list: ['An editorial decision that rests on a factual error or an unfair process.', 'The behaviour of a reviewer, editor or staff member.', 'Delays, billing errors or a failure to follow this site’s published policies.'] },
      { heading: 'How we handle it', paragraphs: ['Write to the editorial office with your Paper ID and the details. We acknowledge your message within two working days. Appeals against a decision are examined by the editor-in-chief or by an editor who was not involved, who may seek a new review. The outcome is sent to you with reasons, normally within 30 days.'] },
      { heading: 'If you are still unhappy', paragraphs: ['If you are not satisfied with the result, you may ask for the matter to be reviewed once more by the managing editor and the editor-in-chief together. Their decision is final for the purpose of this journal.'] },
    ], ['editorial-policy', 'publication-ethics', 'peer-review']),

  P('data', 'Data Policy',
    'Creative studies produce interviews, images, recordings and field notes. This page explains how to share these responsibly.',
    [
      { heading: 'Data availability statement', paragraphs: ['Every article needs a short statement on where the underlying material can be found, or why it cannot be shared. Open deposit in a repository is encouraged where it is ethical and legal to do so.'] },
      { heading: 'When not to share', paragraphs: ['Do not release material that could identify participants, harm communities or breach agreements about culturally sensitive knowledge, sacred or restricted content, or unpublished archive items. In those cases, describe the material, explain the restriction and say who can approve access.'] },
      { heading: 'Good practice', list: ['Anonymise interview transcripts unless participants agreed to be named.', 'Deposit images, scores or recordings you own with clear licences.', 'Cite datasets you use, with a DOI where possible.', 'Keep your raw material for at least five years after publication, in case a reader or editor raises a question.'] },
    ], ['privacy', 'publication-ethics', 'author-guidelines']),

  // ---------------- For authors ----------------
  A('submission-process', 'Submission Process',
    'Eight stages take a paper from your first upload to a published, indexed article. You can follow each stage online with your Paper ID.',
    [
      { heading: 'Before you start', list: ['Prepare the manuscript with the official template and gather permissions for any images.', 'Have the names, affiliations and email addresses of all authors ready.', 'Keep your abstract, keywords and declarations to hand; the form asks for them.'] },
      { heading: 'After you submit', paragraphs: ['You receive a Paper ID such as IJCSD2026000078 and a confirmation email. Use that ID with your email address on the Track My Paper page at any time to see where your paper is, read the editor’s reasons and complete any step that needs you.'] },
    ], ['author-guidelines', 'templates', 'apc-payment'],
    [{ type: 'steps', title: 'The eight stages', items: [
      { title: 'Submission', text: 'Upload the manuscript and declarations. You receive your Paper ID.' },
      { title: 'Review', text: 'An editor checks the paper, then expert reviewers assess it.' },
      { title: 'Decision', text: 'You receive accept, revise or reject, with written reasons.' },
      { title: 'Acceptance', text: 'You receive an acceptance letter and a short publishing agreement.' },
      { title: 'Payment', text: 'Pay the APC online. Indian authors get a GST invoice; others pay no GST.' },
      { title: 'Production', text: 'We typeset the article, check metadata and ask you to approve the proof.' },
      { title: 'Publication', text: 'The article goes live with its DOI and your certificate is issued.' },
      { title: 'Indexing', text: 'We watch for the article in Google Scholar and let you know when it appears.' },
    ] }]),

  A('templates', 'Article Templates',
    'Start from our files to format the manuscript and to write a clear cover letter.',
    [
      { heading: 'How to use them', list: ['Paste your text into the manuscript template instead of changing its styles.', 'Keep headings to three levels and add a caption and credit to every image.', 'Use the cover letter to say what is new and who the work is for.'] },
      { heading: 'Revising after review', paragraphs: ['If the editor asks for changes, answer each reviewer comment in the response template: quote the comment, then say what you changed or why you did not. Highlight changes in the manuscript so the editor can see them.'] },
    ], ['author-guidelines', 'submission-process'],
    [{ type: 'downloads', title: 'Download templates', items: [
      { name: 'Manuscript template', desc: 'For research articles, reviews and short communications.', format: 'DOCX' },
      { name: 'Cover letter template', desc: 'Explain why your paper belongs in IJCSD.', format: 'DOCX' },
      { name: 'Response to reviewers', desc: 'A point-by-point layout for revisions.', format: 'DOCX' },
      { name: 'Image permission form', desc: 'A simple release for people and works you show.', format: 'DOCX' },
    ] }]),

  A('apc-payment', 'APC & Payment',
    'One article processing charge, payable only after acceptance.',
    [
      { heading: 'Amounts', list: ['India: ₹5,500 + 18% GST = ₹6,490.', 'Outside India: US$100 (no GST).'] },
      { heading: 'How to pay', paragraphs: ['Open Track My Paper, enter your Paper ID and email, and choose Pay APC. If you pay by bank transfer or UPI, upload the proof; the editorial office confirms it, usually within two working days. A receipt, or a GST invoice for Indian authors, is issued on confirmation.'] },
      { heading: 'Good to know', paragraphs: ['Nothing is charged at submission or during review. Charges are stated in the currency shown on your invoice. If you need a waiver, request it with your submission rather than after acceptance.'] },
    ], ['publication-charges', 'refund'],
    [{ type: 'faq', title: 'Payment FAQ', items: [
      { q: 'When do I pay?', a: 'Only after acceptance. Nothing is due at submission or during peer review.' },
      { q: 'Which methods work?', a: 'UPI, cards and net banking for Indian authors, and international cards or bank transfer for others.' },
      { q: 'Can I get a waiver?', a: 'Yes. Request one with your submission. The editor-in-chief decides separately from the review.' },
      { q: 'Can I get a refund?', a: 'Refunds apply to duplicate payments or when we cannot publish. See the Refund Policy.' },
    ] }]),

  A('become-a-reviewer', 'Become a Reviewer',
    'Editors invite reviewers when a paper needs specialist input. If you have research or professional expertise in a creative field, we would like to hear from you.',
    [
      { heading: 'What you receive', list: ['A certificate for every completed review.', 'Early sight of new research in your field.', 'A route to the review board for consistent contributors.'] },
      { heading: 'What we ask', paragraphs: ['Reviews are expected within 14 days and must follow the Reviewer Guidelines. Reviews are confidential, and you will be asked only about papers that match the expertise you list. Practice-based researchers, curators and community practitioners with publication experience are welcome to apply.'] },
    ], ['reviewer-guidelines', 'peer-review'],
    [{ type: 'reviewer-form', title: 'Reviewer application' }]),

  // ---------------- About ----------------
  B('journal-information', 'Journal Information',
    'The official record of the journal: title, identifiers, publisher and how to reach the editorial office.',
    [{ heading: 'Overview', paragraphs: [`${NAME} is a monthly, peer-reviewed open access journal. It publishes research on design, the arts, media, culture and development, and welcomes work that links scholarship with practice and with the communities it comes from.`] }],
    ['aims-scope', 'indexing', 'contact'],
    [{ type: 'journal-info' }]),

  B('aims-scope', 'Aims & Scope',
    'IJCSD gives research on creativity, culture and development a fast, fair and permanently open home.',
    [
      { heading: 'Aims', list: ['Publish sound, original work on creative practice and its role in society, free for every reader.', 'Support research that crosses design, the arts, media, heritage and development.', 'Give authors a clear, trackable path to a citable DOI.'] },
      { heading: 'Methods we welcome', paragraphs: ['We welcome practice-based research, ethnography, archival and historical work, participatory and community-led projects, audience and reception studies, and critical or theoretical writing. Studies that explain how they treated participants and cultural material carefully are especially welcome.'] },
      { heading: 'Types of work', paragraphs: ['We publish research articles, review articles, short communications and editorials. Replication studies, case studies and well-documented project reports are considered on their merits.'] },
    ], ['indexing', 'contact', 'author-guidelines'],
    [{ type: 'icon-grid', title: 'Our eight themes', items: [
      { icon: 'design', title: 'Design & Visual Culture', text: 'Graphic, product and craft design; images and material culture.' },
      { icon: 'education', title: 'Arts & Education', text: 'Studio pedagogy, arts integration and creative learning.' },
      { icon: 'media', title: 'Media & Communication', text: 'Film, journalism, community media and audiences.' },
      { icon: 'heritage', title: 'Cultural Heritage & Museums', text: 'Collections, interpretation, memory and oral history.' },
      { icon: 'industries', title: 'Creative Industries', text: 'Cultural policy, creative work, funding and markets.' },
      { icon: 'digital', title: 'Digital Creativity', text: 'Interactive media, generative tools and new forms of making.' },
      { icon: 'development', title: 'Development Studies', text: 'Culture, communication and participation in development.' },
      { icon: 'performing', title: 'Performing Arts & Music', text: 'Theatre, dance, music and embodied knowledge.' },
    ] }]),

  B('indexing', 'Indexing & Abstracting',
    'How IJCSD articles are registered and made findable. We list only the services we can confirm today.',
    [
      { heading: 'What is in place', list: ['Crossref: every article has a registered DOI under the prefix 10.55041.', 'Google Scholar: article pages carry Scholar-compatible metadata, and we check regularly that new papers appear.'] },
      { heading: 'A note on accuracy', paragraphs: ['IJCSD is a new journal. We add a service to this page only after the listing exists, and we do not state impact factors, rankings or database coverage that we do not hold. Select a listing below to check it on the service’s own website.'] },
    ], ['aims-scope', 'contact', 'archiving'],
    [{ type: 'indexing-grid', title: 'Current listings' }]),

  B('contact', 'Contact',
    'The editorial office replies within two working days.',
    [{ heading: 'Before you write', paragraphs: ['For anything about a submission, include your Paper ID. For payment questions, include the payment reference. For a concern about ethics, use the form or write directly to the editor-in-chief through the editorial office.'] }],
    ['aims-scope', 'complaints', 'publication-ethics'],
    [{ type: 'contact-details' }, { type: 'contact-form', title: 'Send us a message' }]),
]

export const pageBySlug = (slug: string) => staticPages.find((p) => p.slug === slug)
