/** Resolves with `compute()` after a simulated 300–800ms network delay. */
export const respond = <T,>(compute: () => T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(compute()), 300 + Math.random() * 500))
