import {
  BaseUpgradeProperty,
  baseUpgradeStats,
  PLAYER_BASE_STATS,
  PLAYER_STAT_OP,
} from "@/const/player";
import { PlayerNyla } from "@/type";

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
