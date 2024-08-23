export const PlayerStatNames = {
  HEALTH: "HEALTH",
  ATTACK_SPEED: "ATTACK_SPEED",
  SPEED: "SPEED",
  DAMAGE: "DAMAGE",
  NYLA_BLAST_DAMAGE: "NYLA_BLAST_DAMAGE",
};

export enum NylaMenu {
  NYLA = "Nyla",
  TRINKETS = "Trinkets",
}

export const baseUpgradeStats = {
  ATTACK: 10,
  HEALTH: 1,
  SPEED: 0.25,
  NYLA_BLAST: 50,
  DASH_COOLDOWN: 100,
};

export const PlayerBaseStats = {
  health: 3,
  speed: 1,
};

export type BaseUpgradeProperty = keyof typeof baseUpgradeStats;

export const MAX_TRINKETS = 2;
