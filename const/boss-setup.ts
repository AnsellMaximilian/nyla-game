import { SetupValues } from "@/type";

export const BossBaseStats = {
  health: 500,
  attackSpeed: 5000,
  speed: 1,
  maxProjectiles: 1,
  projectileLifetime: 5000,
};

export const SetupNames = {
  HEALTH: "HEALTH",
  ATTACK_SPEED: "ATTACK_SPEED",
  SPEED: "SPEED",
  MAX_PROJECTILES: "MAX_PROJECTILES",
  PROJECTILE_LIFETIME: "PROJECTILE_LIFETIME",
};

export const SETUP_VALUES: { [key: string]: SetupValues } = {
  [SetupNames.HEALTH]: {
    default: 1,
    min: 1,
    step: 0.25,
    max: 3,
  },
  [SetupNames.ATTACK_SPEED]: {
    default: 1,
    min: 1,
    step: 0.25,
    max: 3,
  },
  [SetupNames.SPEED]: {
    default: 1,
    min: 1,
    step: 0.25,
    max: 3,
  },
  [SetupNames.MAX_PROJECTILES]: {
    default: 1,
    min: 1,
    step: 1,
    max: 5,
  },
  [SetupNames.PROJECTILE_LIFETIME]: {
    default: 5000,
    min: 5000,
    step: 1000,
    max: 15000,
  },
};
