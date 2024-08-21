export function calculateLevelFromXP(
  xp: number,
  baseXP: number = 500,
  exponent: number = 2
): number {
  const level = Math.pow(xp / baseXP, 1 / exponent);

  return Math.floor(level);
}

export function calculateXPForLevel(
  level: number,
  baseXP: number = 500,
  exponent: number = 2
): number {
  return baseXP * Math.pow(level, exponent);
}
