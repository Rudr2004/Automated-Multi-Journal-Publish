// Deterministic pseudo-random number in [0, 1) from a seed, so mock data is identical on every load.
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}
