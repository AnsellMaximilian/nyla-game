import { SETUP_VALUES, SetupNames } from "@/const/boss-setup";
import { BossParams } from "@/type";

export const getDefaultBossParams = (): BossParams => {
  return {
    healthBoost: SETUP_VALUES[SetupNames.HEALTH].default,
    attackSpeedBoost: SETUP_VALUES[SetupNames.ATTACK_SPEED].default,
    speedBoost: SETUP_VALUES[SetupNames.SPEED].default,
    maxProjectiles: SETUP_VALUES[SetupNames.MAX_PROJECTILES].default,
    projectileLifetime: SETUP_VALUES[SetupNames.PROJECTILE_LIFETIME].default,
  };
};
