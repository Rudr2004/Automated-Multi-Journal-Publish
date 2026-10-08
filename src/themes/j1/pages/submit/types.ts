import type { FormErrors, SubmissionForm } from '../../../../core/lib/submission'

/** Props shared by every step of the submission wizard. */
export interface StepProps {
  form: SubmissionForm
  errors: FormErrors
  onChange: (next: SubmissionForm) => void
}
