// The referral system can be paused (Admin panel: Referral Management). While paused, the submission form has no referral code field and
// the Track Status page shows no referral details. Records already created are never touched; resuming shows everything again.
import { journal } from '../../config/journals'

export const referralOn = () => journal.referralSystem !== false
