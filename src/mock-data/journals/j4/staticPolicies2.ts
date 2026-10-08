// Journal 4 (IJECM) policies, part 2: retraction, corrections, archiving, guidelines, charges, refunds, complaints, data.
import type { StaticPageData } from '../../../core/types'
import { P } from './staticHelpers'

export const policiesTwo: StaticPageData[] = [
  P('retraction', 'Retraction Policy',
    'Retraction is a last resort for articles that cannot be relied on. When we do it, we do it openly.',
    [
      { heading: 'When we retract', list: ['Evidence of fabricated or manipulated data, measurements or images.', 'Serious plagiarism, or publication without the necessary permissions.', 'Duplicate publication, or an honest error so serious that the conclusions no longer hold, for example a calculation fault that invalidates a stated capacity.'] },
      { heading: 'How we retract', paragraphs: ['The article stays online, marked clearly as retracted, with a notice that states the reason, who requested it and the date. The notice is linked to the article and to its DOI metadata. We do not delete retracted papers, so the record stays complete.'] },
      { heading: 'Before a decision', paragraphs: ['The editor-in-chief reviews the evidence, invites the authors to reply and may consult independent experts. Where an error is fixable, a correction is preferred. See Corrections and Errata.'] },
    ], ['corrections', 'publication-ethics', 'complaints']),

  P('corrections', 'Corrections and Errata',
    'Mistakes happen. When one is found after publication, we fix it in public.',
    [
      { heading: 'Types of correction', list: ['Erratum: an error made by the journal, such as a wrong figure or missing author.', 'Corrigendum: an error made by the authors that affects meaning or credit, such as a wrong equation or unit.', 'Minor typographical changes that do not affect understanding may be made with a note in the article history.'] },
      { heading: 'How to ask for one', paragraphs: ['Write to editor@ijecm.org with the DOI, what is wrong and what it should say. Corrections affecting authorship, permissions or conclusions need the agreement of every author.'] },
      { heading: 'How corrections appear', paragraphs: ['The corrected article carries a visible notice linking to the correction, which is published with its own record. The original version stays available in the article history.'] },
    ], ['retraction', 'publication-ethics', 'author-guidelines']),

  P('archiving', 'Archiving Policy',
    'Articles should stay findable and readable for the long term. This page explains what we do and what we do not yet do.',
    [
      { heading: 'Permanent identifiers', paragraphs: ['Each article receives a DOI under the prefix 10.55041, registered with Crossref. If the web address of an article ever changes, the DOI is updated to point to the new location, so existing citations keep working.'] },
      { heading: 'Preservation', paragraphs: ['The publisher keeps secure, regularly tested backups of all published articles, files and metadata. IJECM does not currently take part in a third-party preservation service; this page will be updated if that changes.'] },
      { heading: 'Author deposit', paragraphs: ['Authors are encouraged to place the published PDF in an institutional or subject repository and to link it to the DOI. The CC BY 4.0 licence permits this without asking permission.'] },
    ], ['open-access', 'copyright-licensing', 'data']),

  P('author-guidelines', 'Author Guidelines',
    'Everything you need before you submit: what we publish, how to prepare the manuscript and what to declare.',
    [
      { heading: 'What we publish', paragraphs: ['IJECM publishes research articles, review articles, case studies, short communications and editorials in English, across nine areas: civil and structural; mechanical and manufacturing; electrical and power; electronics and embedded; computer and control; industrial and systems; operations and supply chain; project and engineering management; and smart and sustainable infrastructure.'], list: ['Research articles: original studies, typically 5,000 to 8,000 words including references.', 'Review articles: critical syntheses of a body of work, with a stated search method.', 'Case studies and short communications: up to 3,000 words, reporting a project, an installation or early findings.'] },
      { heading: 'Preparing the manuscript', list: ['Use the manuscript template and keep headings to three levels.', 'Add a structured abstract of up to 250 words and 4 to 8 keywords.', 'Use SI units, define every symbol at first use and number equations.', 'Describe materials, specimens, instruments, software versions and data sources so that the work can be repeated; for models, give validation and uncertainty.', 'Place figures and tables where they are first mentioned, with captions, credits and alternative text.', 'Cite sources in one consistent style and give a DOI or link wherever one exists.'] },
      { heading: 'Declarations', paragraphs: ['At submission you confirm that the work is original and not under review elsewhere, that all authors approve it, and that you hold permissions for third-party material. Add statements on ethics approval or consent where people took part, funding, conflicts of interest, data availability and any use of AI tools.'], callout: { tone: 'info', title: 'Before you press submit', text: 'Check names, affiliations and email addresses carefully. Authorship changes after acceptance require the written agreement of every author.' } },
    ], ['submission-process', 'templates', 'ai-policy'],
    { blocks: [{ type: 'faq', title: 'Common questions', items: [
      { q: 'Do you accept conference extensions?', a: 'Yes, if the journal paper adds substantial new content and the earlier paper is cited and disclosed in the cover letter.' },
      { q: 'Is there a word limit?', a: 'Research articles usually run 5,000 to 8,000 words including references. Short communications are up to 3,000 words. Tell the editor in your cover letter if you need more.' },
      { q: 'Do I need ethics approval?', a: 'If people took part, for example in surveys or interviews, state which body approved the study or explain why approval was not required, and say how consent was obtained.' },
      { q: 'Can I submit a preprint?', a: 'Yes. Mention the preprint in your cover letter and link it in the manuscript.' },
    ] }] }),

  P('reviewer-guidelines', 'Reviewer Guidelines',
    'A good review helps the editor decide and helps the author improve. This page sets out what we ask of you.',
    [
      { heading: 'Before you accept', paragraphs: ['Accept only if the topic and method are within your expertise, you can return the report in the time asked, and you have no conflict of interest. If you cannot review, say so quickly and suggest another person if you can.'] },
      { heading: 'Writing the report', list: ['Summarise the contribution in a few sentences so the editor knows you understood it.', 'Comment on novelty, soundness of method, validity of assumptions, quality of data and whether the conclusions follow.', 'Check units, dimensional consistency and whether results are compared with a credible baseline or standard.', 'Separate comments for the author from confidential remarks for the editor.', 'Be specific and courteous. Critique the work, not the person.'] },
      { heading: 'Confidentiality', paragraphs: ['Do not share, discuss or use the manuscript beyond the review. Do not contact the authors directly. If you recognise a problem such as plagiarism or undisclosed overlap, tell the editor.'] },
    ], ['peer-review', 'conflict-of-interest', 'become-a-reviewer']),

  P('editorial-policy', 'Editorial Policy',
    'How editors make decisions and keep them independent of anything but the quality and relevance of the work.',
    [
      { heading: 'Independence', paragraphs: ['The editor-in-chief has full authority over what is published. Commercial, institutional or personal interests, including those of the publisher, have no say in a decision, and the ability to pay a charge is never part of the review.'] },
      { heading: 'Roles', paragraphs: ['The editor-in-chief sets direction and handles appeals. The managing editor runs day-to-day operations. Associate editors handle manuscripts in their area, and the editorial and review boards advise on policy and review papers.'] },
      { heading: 'Fairness and consistency', paragraphs: ['Editors apply the same criteria to every submission, record the reason for each decision and recuse themselves when they have a conflict. Themed sections and commissioned pieces go through the same review as other papers.'] },
    ], ['peer-review', 'conflict-of-interest', 'complaints']),

  P('publication-charges', 'Publication Charges',
    'IJECM charges one article processing charge (APC), payable only after your paper is accepted.',
    [
      { heading: 'The charge', paragraphs: ['The APC covers editorial handling, typesetting, DOI registration, hosting and the author certificate. There is no fee to submit, no charge for peer review and no hidden extras.'], list: ['Authors in India: ₹6,000 plus 18% GST (₹1,080), a total of ₹7,080.', 'Authors elsewhere: US$110, with no GST.'] },
      { heading: 'When you pay', paragraphs: ['You receive an invoice with your acceptance letter. Production starts once payment is confirmed. Payment details are on the APC and Payment page.'] },
      { heading: 'Waivers', paragraphs: ['A waiver or partial waiver can be requested at submission and is decided by the editor-in-chief independently of peer review. Students, early-career researchers and authors in low-income settings are especially encouraged to ask.'] },
    ], ['apc-payment', 'refund', 'open-access']),

  P('refund', 'Refund Policy',
    'Refunds are limited, but clear. Here is when they apply.',
    [
      { heading: 'When we refund', list: ['You paid twice for the same paper.', 'The journal cannot publish your paper after you paid, for example because of an editorial or technical failure on our side.', 'A payment was made to the wrong paper and production has not started.'] },
      { heading: 'When we do not', paragraphs: ['Once an article is published, the charge is not refunded. A paper withdrawn by the author after production has begun is not refunded either, as the editorial and typesetting work is done. A paper retracted for misconduct is not refunded.'] },
      { heading: 'How to ask', paragraphs: ['Write to editor@ijecm.org within 30 days of payment with your Paper ID and payment reference. Approved refunds are returned to the original payment method within 14 working days; bank fees may be deducted for international transfers.'] },
    ], ['publication-charges', 'apc-payment', 'complaints']),

  P('complaints', 'Complaints and Appeals',
    'If you think we got something wrong, tell us. We take every complaint seriously and answer it in writing.',
    [
      { heading: 'What you can raise', list: ['An editorial decision that rests on a factual error or an unfair process.', 'The behaviour of a reviewer, editor or staff member.', 'Delays, billing errors or a failure to follow the policies published on this site.'] },
      { heading: 'How we handle it', paragraphs: ['Write to editor@ijecm.org with your Paper ID and the details. We acknowledge your message within two working days. Appeals against a decision are examined by the editor-in-chief or by an editor who was not involved, who may seek a new review. The outcome is sent to you with reasons, normally within 30 days.'] },
      { heading: 'If you are still unhappy', paragraphs: ['You may ask for the matter to be reviewed once more by the managing editor and the editor-in-chief together. Their decision is final for the purpose of this journal.'] },
    ], ['editorial-policy', 'publication-ethics', 'peer-review']),

  P('data', 'Data Policy',
    'Engineering studies produce measurements, models, code and survey records. This page explains how to share them responsibly.',
    [
      { heading: 'Data availability statement', paragraphs: ['Every article needs a short statement on where the underlying data, code or models can be found, or why they cannot be shared. Open deposit in a repository is encouraged where it is lawful and sensible to do so.'] },
      { heading: 'When not to share', paragraphs: ['Do not release material that could identify survey respondents, breach a client or supplier agreement, expose security-sensitive details of infrastructure or reveal unpublished commercial processes. In those cases, describe the data, explain the restriction and say who can approve access.'] },
      { heading: 'Good practice', list: ['Deposit test data, simulation inputs and code with clear licences and version numbers.', 'Anonymise survey and interview records unless participants agreed to be named.', 'Cite datasets and software you use, with a DOI where possible.', 'Keep raw records for at least five years after publication in case a reader or editor raises a question.'] },
    ], ['privacy', 'publication-ethics', 'author-guidelines']),
]
