import {
  BaseUpgradeProperty,
  baseUpgradeStats,
  PLAYER_BASE_STATS,
  PLAYER_STAT_OP,
} from "@/const/player";
import { PlayerNyla, Trinket } from "@/type";

export const getBoostedStat = (
  stat: BaseUpgradeProperty,
  upgrades: PlayerNyla["upgrades"],
  op: PLAYER_STAT_OP = PLAYER_STAT_OP.ADD
) => {
  const upgradesTotal = upgrades.filter((u) => u === stat).length;
  let val = PLAYER_BASE_STATS[stat];
  switch (op) {
    case PLAYER_STAT_OP.ADD:
      val = PLAYER_BASE_STATS[stat] + baseUpgradeStats[stat] * upgradesTotal;
      break;
    default:
      break;
  }
  return val;
};

export const getBoostStatFromTrinkets = (
  trinkets: Trinket[],
  stat: BaseUpgradeProperty
) => {
  const relevantTrinkets = trinkets.filter((t) => t.boostedStat === stat);

  return relevantTrinkets.reduce((sum, t) => {
    let val = 0;

    if (t.boostType === "INCREASE") {
      sum += t.boostValue;
    } else if (t.boostType === "DECREASE") {
      sum -= t.boostValue;
    }

    return val;
  }, 0);
};

export const getBoostStatFromTrinket = (
  trinket: Trinket,
  stat: BaseUpgradeProperty
) => {
  if (stat !== trinket.boostedStat) return 0;

  if (trinket.boostType === "INCREASE") {
    return trinket.boostValue;
  } else if (trinket.boostType === "DECREASE") {
    return -trinket.boostValue;
  }

  return 0;
};
