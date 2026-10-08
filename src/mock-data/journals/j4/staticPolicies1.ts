// Journal 4 (IJECM) policies, part 1: ethics, review, licensing, open access, privacy, plagiarism, AI, conflicts.
import type { StaticPageData } from '../../../core/types'
import { NAME, P } from './staticHelpers'

export const policiesOne: StaticPageData[] = [
  P('publication-ethics', 'Publication Ethics and Malpractice',
    `Engineering results are used to design bridges, grids and production lines, so errors and shortcuts carry real consequences. ${NAME} expects honest reporting from authors, reviewers and editors alike.`,
    [
      { heading: 'Standards we follow', paragraphs: ['Our practice is guided by COPE-style good-practice principles for editors, reviewers and authors. IJECM is not a member of COPE; we use those widely shared principles as a reference for how we behave and how we handle problems.'], list: ['Work must be original, honestly reported and supported by data, models or calculations the authors can produce on request.', 'Authorship is limited to people who made a substantial contribution and who approve the final text.', 'Editorial decisions rest on the quality and relevance of the work, never on nationality, gender, institution or ability to pay.', 'Reviewers treat manuscripts as confidential and declare any conflict of interest before accepting an invitation.'] },
      { heading: 'Reporting engineering work', paragraphs: ['Experimental and field studies must give enough detail on specimens, instruments, calibration, boundary conditions and uncertainty for a competent group to repeat the work. Simulation papers must state the software, version, mesh or time-step settings and validation basis. Safety-critical results, such as load capacities or protection settings, must not be presented with more certainty than the evidence supports.'] },
      { heading: 'Misconduct and malpractice', paragraphs: ['Fabricated or selectively reported measurements, manipulated images or plots, undisclosed re-use of one’s own published text, and duplicate submission are treated as malpractice. We investigate concerns in confidence, give the authors a chance to respond, and may correct, retract or inform the authors’ institution.'], callout: { tone: 'info', title: 'Raise a concern', text: 'Write to editor@ijecm.org with the Paper ID or DOI and the reason for your concern. We acknowledge every concern within two working days.' } },
    ], ['plagiarism', 'conflict-of-interest', 'retraction'], { principles: true }),

  P('peer-review', 'Peer Review Process',
    'Every submission follows the same path: an editor’s check, expert review against a published checklist, and a decision that comes with written reasons.',
    [
      { heading: 'How review works', paragraphs: ['IJECM uses single-anonymised peer review: reviewers can see who wrote the paper, while authors are not told who reviewed it. Reviewers are chosen for their familiarity with the topic and the method, whether that is laboratory testing, field monitoring, numerical modelling, survey research or a case-based management study.'], list: ['An editor first checks scope, completeness, ethics statements and the similarity-screening report.', 'Papers that fit are sent to at least two reviewers, with a target of 14 days for the first decision.', 'The handling editor weighs the reports and chooses accept, minor revision, major revision or reject.'] },
      { heading: 'What reviewers check', list: ['Is the problem clearly stated and is the contribution new relative to cited work?', 'Are methods described well enough to be repeated, and are the assumptions justified?', 'Do the data, validation and uncertainty support the conclusions?', 'For management and operations studies: are sampling, constructs and models appropriate to the claims?', 'Is the paper clear, correctly referenced and within scope?'] },
      { heading: 'Decisions and appeals', paragraphs: ['Every decision includes the reviewers’ comments or the editor’s reasons. An author who believes a decision rested on a factual error can appeal once, within 30 days, as described in Complaints and Appeals. Appeals are handled by an editor who was not involved in the original decision whenever possible.'] },
    ], ['reviewer-guidelines', 'editorial-policy', 'complaints'],
    { blocks: [{ type: 'flow', title: 'From submission to decision', nodes: [
      { label: 'Submit', note: 'You receive a Paper ID' }, { label: 'Editor check', note: 'Scope and ethics' }, { label: 'Reviewers', note: 'At least two' },
      { label: 'Reports', note: 'Target 14 days' }, { label: 'Decision', note: 'With reasons' }, { label: 'Revision', note: 'If asked' },
    ] }] }),

  P('copyright-licensing', 'Copyright and Licensing',
    'Authors keep the copyright in their work. Readers may reuse it, with credit, under the Creative Commons CC BY 4.0 licence.',
    [
      { heading: 'What the licence allows', paragraphs: ['All IJECM articles are published under CC BY 4.0. Anyone may copy, share, translate, adapt and build on an article, including commercially, as long as they credit the authors, link to the licence and say whether changes were made.'] },
      { heading: 'Third-party material', paragraphs: ['The licence covers your text and your own figures. It does not cover material owned by someone else, such as a drawing from a design code, a photograph of a site, a manufacturer’s data sheet or a figure from another paper. For each such item, either obtain permission to publish it under CC BY 4.0 or state in the caption that it is used with permission and is excluded from the licence.'], list: ['Keep written permissions; the editor may ask for them.', 'Give the rights holder’s name and the source in the caption.', 'Redraw or replace items that cannot be cleared.'] },
      { heading: 'Your agreement with us', paragraphs: ['On acceptance you sign a short publishing agreement. It confirms that you hold the rights to what you submit and grants IJECM permission to publish the article under CC BY 4.0. You may deposit the published article in a repository or post it on your own site at any time.'] },
    ], ['open-access', 'plagiarism', 'archiving']),

  P('open-access', 'Open Access Policy',
    'IJECM is free to read. Readers never meet a paywall, a login or a subscription.',
    [
      { heading: 'What open access means here', paragraphs: ['Every article is available in full on the journal website from the day it appears, with no registration. Authors pay a one-time article processing charge only after their paper has been accepted; that charge is what keeps reading free.'] },
      { heading: 'Reuse and sharing', paragraphs: ['Because articles carry the CC BY 4.0 licence, lecturers can build reading lists, practitioners can cite methods in design reports and standards committees can quote findings, as long as the authors are credited.'] },
      { heading: 'Funding and waivers', paragraphs: ['Funding should not decide who is heard. Authors who cannot meet the charge, particularly early-career researchers, students and those in low-income settings, may request a waiver or partial waiver at submission. The request is decided separately from peer review and does not affect the editorial decision.'] },
    ], ['copyright-licensing', 'publication-charges', 'archiving']),

  P('privacy', 'Privacy Policy',
    'What personal information the journal collects, why we collect it and how long we keep it.',
    [
      { heading: 'What we collect', list: ['Authors: name, email address, institution, country, ORCID iD if provided, and the manuscript and related files.', 'Reviewers and editors: contact details, areas of expertise and a record of reviews completed.', 'People who write to us or subscribe to alerts: the details they enter in the form.', 'Visitors: basic technical data such as pages visited, used in aggregate to improve the site.'] },
      { heading: 'How we use it', paragraphs: ['We use personal data to run peer review, communicate about submissions, issue invoices and certificates, register DOIs with Crossref and keep a record of editorial decisions. We do not sell personal data. We share it only with people and services needed to publish your work, such as a reviewer who receives the manuscript or a payment processor.'] },
      { heading: 'Your choices', paragraphs: ['You can ask us to show, correct or delete personal data we hold, subject to records we need to keep, for example the authorship and date of a published article. Published articles and author names remain public. Write to editor@ijecm.org to make a request; we respond within 30 days and handle data in line with the data protection law that applies in India.'] },
    ], ['data', 'publication-ethics', 'complaints']),

  P('plagiarism', 'Plagiarism Policy',
    'Credit what you borrow. Every submission is screened for overlap with earlier work.',
    [
      { heading: 'What counts as plagiarism', list: ['Copying text, figures, equations, tables or code from others without credit.', 'Close paraphrase that follows another source’s structure without attribution.', 'Re-using your own earlier published text or figures without saying so (text recycling).', 'Presenting a published design method or dataset as your own work.'] },
      { heading: 'How we check', paragraphs: ['Submissions are run through similarity-screening software and the editor reads the report instead of relying on a percentage. Quoted passages, reference lists, standard method descriptions and code-clause citations are expected to match; unexplained overlap with a single source is not.'] },
      { heading: 'What happens next', paragraphs: ['Minor overlap is returned to the author for rewriting. Substantial or deliberate copying leads to rejection and, for published papers, correction or retraction. Serious cases may be reported to the author’s institution. Authors are always invited to explain before a decision is made.'] },
    ], ['publication-ethics', 'retraction', 'ai-policy']),

  P('ai-policy', 'AI Policy',
    'Generative tools are now part of engineering work. This page explains what is allowed in a manuscript, in review and in the figures you send us.',
    [
      { heading: 'For authors', paragraphs: ['AI tools may support language editing, translation or code assistance, but they cannot be listed as authors, because they cannot take responsibility for a work. If you use a generative tool for text, code, analysis or figures, state it in the Methods or Acknowledgements, naming the tool, its version and what it was used for. You remain responsible for accuracy, references and the rights in anything the tool produced.'] },
      { heading: 'Data, models and images', paragraphs: ['Machine-learning models used as a research method are not restricted by this policy; describe them in full, including training data, validation split and software versions. We do not publish AI-generated images presented as measurements, micrographs, site photographs or experimental records, and invented data, references or citations are treated as fabrication.'] },
      { heading: 'For reviewers and editors', paragraphs: ['Manuscripts are confidential. Reviewers and editors must not upload a manuscript, or parts of one, to a public AI service. Tools may be used privately to polish the wording of your own report, but the technical judgement in it must be yours.'] },
    ], ['plagiarism', 'publication-ethics', 'author-guidelines']),

  P('conflict-of-interest', 'Conflict of Interest',
    'A conflict is not wrongdoing. Hiding one is a problem. Tell us, and we will manage it.',
    [
      { heading: 'What to declare', list: ['Financial ties such as funding, consultancy, patents or ownership of a company that makes or sells what the paper evaluates.', 'Personal or professional relationships with organisations studied, including client, employer or collaborator links.', 'Competing intellectual interests, such as a rival method or a pending patent application.'] },
      { heading: 'Authors', paragraphs: ['Include a conflict statement in the manuscript, even if it says that you have none. Authors who tested their own commercial product, or who studied a project they were paid to deliver, must say so.'] },
      { heading: 'Reviewers and editors', paragraphs: ['Decline to review a paper from a recent collaborator, a colleague at your institution or a direct competitor. Editors do not handle papers from their own institution or co-authors; those pass to another editor, and the declaration is recorded.'] },
    ], ['publication-ethics', 'editorial-policy', 'reviewer-guidelines']),
]
