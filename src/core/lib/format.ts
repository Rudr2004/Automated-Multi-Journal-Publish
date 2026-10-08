const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/** 2026-09-15 → "15 Sep 2026" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}

/** 2026-09 or 2026-09-15 → "September 2026" */
export function formatMonthYear(iso: string): string {
  const [y, m] = iso.split('-').map(Number)
  return `${MONTHS_LONG[m - 1]} ${y}`
}

/** 8245 → "8,245" */
export const formatNumber = (n: number) => new Intl.NumberFormat('en-US').format(n)
