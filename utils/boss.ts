import { SETUP_VALUES, SetupNames, XP_BOOST_AMOUNT } from "@/const/boss-setup";
import { BossParams } from "@/type";

export const getDefaultBossParams = (): BossParams => {
  return {
    healthBoost: SETUP_VALUES[SetupNames.HEALTH].default,
    attackSpeedBoost: SETUP_VALUES[SetupNames.ATTACK_SPEED].default,
    speedBoost: SETUP_VALUES[SetupNames.SPEED].default,
    maxProjectiles: SETUP_VALUES[SetupNames.MAX_PROJECTILES].default,
    projectileLifetime: SETUP_VALUES[SetupNames.PROJECTILE_LIFETIME].default,
    projectileBounces: false,
  };
};

export const getXpBoost = (bossParams: BossParams) => {
  const hlt =
    (bossParams.healthBoost - SETUP_VALUES[SetupNames.HEALTH].min) /
    SETUP_VALUES[SetupNames.HEALTH].step;
  const att =
    (bossParams.attackSpeedBoost - SETUP_VALUES[SetupNames.ATTACK_SPEED].min) /
    SETUP_VALUES[SetupNames.ATTACK_SPEED].step;
  const spd =
    (bossParams.speedBoost - SETUP_VALUES[SetupNames.SPEED].min) /
    SETUP_VALUES[SetupNames.SPEED].step;
  const mps =
    (bossParams.maxProjectiles - SETUP_VALUES[SetupNames.MAX_PROJECTILES].min) /
    SETUP_VALUES[SetupNames.MAX_PROJECTILES].step;
  const plt =
    (bossParams.projectileLifetime -
      SETUP_VALUES[SetupNames.PROJECTILE_LIFETIME].min) /
    SETUP_VALUES[SetupNames.PROJECTILE_LIFETIME].step;
  const pbs = bossParams.projectileBounces ? 1 : 0;

  const total = hlt + att + spd + mps + plt + pbs;

  console.log({ hlt, att, spd, mps, plt, pbs });

  return parseFloat((1 + total * XP_BOOST_AMOUNT).toFixed(10));
};
