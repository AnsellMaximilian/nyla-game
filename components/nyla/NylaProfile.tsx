"use client";

import Image from "next/image";
import React, { useState } from "react";
import Container from "../Container";
import { ClientPlayerNyla, PlayerNyla } from "@/type";
import { calculateLevelFromXP, calculateXPForLevel } from "@/utils/leveling";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import {
  BaseUpgradeProperty,
  baseUpgradeStats,
  PLAYER_BASE_STATS,
} from "@/const/player";
import axios from "axios";

const NylaStat = ({
  stat,
  base,
  addition,
  nyla,
  canAdd = false,
  canSubtract = false,
  onAdd,
  onSubtract,
  boosted,
}: {
  stat: string;
  base: number;
  addition: string;
  onAdd: () => void;
  onSubtract: () => void;
  nyla: ClientPlayerNyla;
  canAdd?: boolean;
  canSubtract?: boolean;
  boosted: number;
}) => {
  return (
    <div className="flex justify-between text-2xl">
      <div>{stat}</div>
      <div className="flex gap-2 items-center">
        <div className="font-bold flex gap-2 items-center">
          <div>{base}</div>
          <div className="text-lg font-normal">(+{boosted})</div>
        </div>
        <div className="gap-2 flex items-center text-lg">
          <Button className="p-2" disabled={!canSubtract} onClick={onSubtract}>
            <Minus size={16} />
          </Button>
          <div className="w-12 text-center">{addition}</div>

          <Button className="p-2" disabled={!canAdd} onClick={onAdd}>
            <Plus size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function NylaProfile({
  nyla: nylaOld,
}: {
  nyla: ClientPlayerNyla;
}) {
  const [chosenUpgrades, setChosenUpgrades] = useState<BaseUpgradeProperty[]>(
    []
  );

  const [nyla, setNyla] = useState(nylaOld);

  const availablePoints =
    calculateLevelFromXP(nyla.xp) -
    nyla.upgrades.length -
    chosenUpgrades.length;

  console.log({
    availablePoints,
    totalFromLevel: calculateLevelFromXP(nyla.xp),
    totalCurrent: nyla.upgrades.length,
    chosenTotal: chosenUpgrades.length,
  });

  const handleUpgrade = async () => {
    const res = await axios.post("/api/nylas/upgrade", {
      upgrades: chosenUpgrades,
    });

    setNyla(res.data as ClientPlayerNyla);
    setChosenUpgrades([]);
  };
  return (
    <Container>
      <div className="flex gap-8">
        <div className="border-[12px] rounded-md overflow-hidden border-primary">
          <Image
            src="/images/nyla-profile.png"
            alt="Nyla Profile"
            width={320}
            height={640}
          />
        </div>
        <div className="grow flex flex-col">
          <header className="text-center">
            <h1 className="text-4xl font-bold">{nyla.email}</h1>
            <div className="text-3xl">
              Level {calculateLevelFromXP(nyla.xp)}
            </div>
          </header>
          <Separator className="text-white bg-white h-1 my-4" />
          <div className="flex flex-col grow">
            <h2 className="text-2xl font-bold">Upgrades</h2>
            <div className="mt-4 space-y-2">
              <NylaStat
                canAdd={availablePoints > 0}
                canSubtract={chosenUpgrades.includes("ATTACK")}
                nyla={nyla}
                onAdd={() => {
                  setChosenUpgrades((prev) => [...prev, "ATTACK"]);
                }}
                onSubtract={() => {
                  setChosenUpgrades((prev) => {
                    const newArr = [...prev];

                    let index = newArr.lastIndexOf("ATTACK");
                    if (index !== -1) {
                      newArr.splice(index, 1);
                    }

                    return newArr;
                  });
                }}
                stat="Attack"
                base={PLAYER_BASE_STATS.ATTACK}
                boosted={
                  baseUpgradeStats.ATTACK *
                  (nyla as PlayerNyla).upgrades.filter((u) => u === "ATTACK")
                    .length
                }
                addition={`+${
                  baseUpgradeStats.ATTACK *
                  chosenUpgrades.filter((u) => u === "ATTACK").length
                }`}
              />

              <NylaStat
                canAdd={availablePoints > 0}
                canSubtract={chosenUpgrades.includes("HEALTH")}
                nyla={nyla}
                onAdd={() => {
                  setChosenUpgrades((prev) => [...prev, "HEALTH"]);
                }}
                onSubtract={() => {
                  setChosenUpgrades((prev) => {
                    const newArr = [...prev];

                    let index = newArr.lastIndexOf("HEALTH");
                    if (index !== -1) {
                      newArr.splice(index, 1);
                    }

                    return newArr;
                  });
                }}
                stat="Health"
                base={PLAYER_BASE_STATS.HEALTH}
                boosted={
                  baseUpgradeStats.HEALTH *
                  (nyla as PlayerNyla).upgrades.filter((u) => u === "HEALTH")
                    .length
                }
                addition={`+${
                  baseUpgradeStats.HEALTH *
                  chosenUpgrades.filter((u) => u === "HEALTH").length
                }`}
              />

              <NylaStat
                canAdd={availablePoints > 0}
                canSubtract={chosenUpgrades.includes("SPEED")}
                nyla={nyla}
                onAdd={() => {
                  setChosenUpgrades((prev) => [...prev, "SPEED"]);
                }}
                onSubtract={() => {
                  setChosenUpgrades((prev) => {
                    const newArr = [...prev];

                    let index = newArr.lastIndexOf("SPEED");
                    if (index !== -1) {
                      newArr.splice(index, 1);
                    }

                    return newArr;
                  });
                }}
                stat="Speed"
                base={PLAYER_BASE_STATS.SPEED}
                boosted={
                  baseUpgradeStats.SPEED *
                  (nyla as PlayerNyla).upgrades.filter((u) => u === "SPEED")
                    .length
                }
                addition={`+${
                  baseUpgradeStats.SPEED *
                  chosenUpgrades.filter((u) => u === "SPEED").length
                }`}
              />
            </div>
            <div className="flex justify-end mt-4 text-xl">
              Avaliable points: {availablePoints}
            </div>
            <div className="mt-auto text-right">
              <Button
                className="text-xl"
                disabled={
                  availablePoints != chosenUpgrades.length &&
                  availablePoints > 0
                }
                onClick={handleUpgrade}
              >
                Confirm Upgrade
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
