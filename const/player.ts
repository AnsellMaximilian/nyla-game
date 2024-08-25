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
  SPEED: 0.5,
  NYLA_BLAST: 1,
  DASH_COOLDOWN: 100,
  NYLA_BLAST_METER: 2500,
};

export const PlayerBaseStats = {
  health: 3,
  speed: 1,
};

export type BaseUpgradeProperty = keyof typeof baseUpgradeStats;

export const MAX_TRINKETS = 2;

export const PLAYER_BASE_STATS: Record<BaseUpgradeProperty, number> = {
  ATTACK: 20,
  HEALTH: 3,
  SPEED: 1,
  DASH_COOLDOWN: 2000,
  NYLA_BLAST: 15,
  NYLA_BLAST_METER: 10000,
};

export enum PLAYER_STAT_OP {
  ADD,
}
