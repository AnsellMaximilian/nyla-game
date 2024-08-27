"use client";

import React, { useState } from "react";
import Container from "@/components/Container";
import { TRINKETS } from "@/const/trinkets";
import Image from "next/image";
import { PlayerNyla, Trinket } from "@/type";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  hasBeenADaySince,
  snakeCaseToTitleCase,
  timeUntilNextSpin,
} from "@/utils/common";
import { LoaderPinwheel } from "lucide-react";
import axios from "axios";
import Spinner from "./Spinner";
import { Separator } from "@radix-ui/react-separator";
import { useToast } from "../ui/use-toast";
import SpinnerV2 from "./SpinnerV2";

export default function TrinketList({ nyla }: { nyla: PlayerNyla }) {
  const [selectedTrinket, setSelectedTrinket] = useState<Trinket>(TRINKETS[0]);
  const [isSpinningForTrinket, setIsSpinningForTrinket] = useState(false);
  const [receivedTrinket, setReceivedTrinket] = useState<null | Trinket>(null);
  const [spinLoading, setSpinLoading] = useState(false);

  const [localNyla, setLocalNyla] = useState(nyla);

  const [togglingTrinket, setTogglingTrinket] = useState(false);
  const { toast } = useToast();

  const playerHasSelectedTrinket = localNyla.trinkets.includes(
    selectedTrinket.id
  );

  const spin = async () => {
    try {
      setSpinLoading(true);
      const res = await axios.post("/api/nylas/spin-trinket");

      const spinResult = res.data as {
        updatedPlayerNyla: PlayerNyla;
        receivedTrinket: Trinket;
      };

      setIsSpinningForTrinket(true);
      setReceivedTrinket(spinResult.receivedTrinket);
      setLocalNyla((prev) => ({
        ...prev,
        last_trinket_spin: spinResult.updatedPlayerNyla.last_trinket_spin,
      }));
    } catch (error) {
      let msg = "Error spinning for trinket";
      if (error instanceof Error) msg = error.message;
      toast({
        title: msg,
        variant: "destructive",
      });
    } finally {
      setSpinLoading(false);
    }
  };

  const toggleTrinket = async (trinketId: string) => {
    try {
      setTogglingTrinket(true);
      const res = await axios.post("/api/nylas/equip-trinket", {
        trinketId,
        unequip: trinketId === localNyla.equipped_trinket,
      });

      const toggleRes = res.data as PlayerNyla;

      setLocalNyla((prev) => ({
        ...prev,
        equipped_trinket: toggleRes.equipped_trinket,
      }));
    } catch (error) {
      let msg = "Error equipping/unequpping trinket";
      if (error instanceof Error) msg = error.message;
      toast({
        title: msg,
        variant: "destructive",
      });
    } finally {
      setTogglingTrinket(false);
    }
  };

  return (
    <Container>
      <header className="flex justify-between mb-8">
        <h1 className="text-4xl font-bold ">Trinkets</h1>
        <Button
          disabled={
            localNyla.last_trinket_spin !== null &&
            !hasBeenADaySince(localNyla.last_trinket_spin)
          }
          className="flex items-center gap-2"
          onClick={spin}
        >
          <LoaderPinwheel />

          <span className="text-xl">
            {spinLoading
              ? "Loading..."
              : timeUntilNextSpin(localNyla.last_trinket_spin)}
          </span>
        </Button>
      </header>
      <div className="flex gap-8 min-h-[600px] items-start h-[1500px] ">
        <div className="gap-4 flex flex-wrap justify-between">
          {TRINKETS.map((t) => {
            const playerHasTrinket = localNyla.trinkets.includes(t.id);
            return (
              <div
                key={t.id}
                className={cn(
                  " w-40 h-40 flex items-center justify-center bg-contain p-8 bg-no-repeat relative",
                  playerHasTrinket
                    ? "bg-[url('/images/trinkets/trinket-frame.png')] cursor-pointer"
                    : ""
                )}
                onClick={() => setSelectedTrinket(t)}
              >
                {!(selectedTrinket === t) && playerHasTrinket && (
                  <div className="absolute inset-0 bg-black/50"></div>
                )}

                {localNyla.equipped_trinket === t.id && (
                  // <Image
                  //   src="/images/metal-nyla.png"
                  //   width={320}
                  //   height={320}
                  //   alt="equipped symbol"
                  //   className="absolute left-1/2 -translate-x-1/2 -top-4 w-16" />

                  <div className="bg-primary rounded-md px-3 py-1 absolute bottom-0 left-1/2 -translate-x-1/2">
                    Equipped
                  </div>
                )}
                <div className="">
                  {playerHasTrinket ? (
                    <Image
                      src={t.image}
                      alt={t.name}
                      width={320}
                      height={320}
                      className={cn(
                        "h-full w-full"
                        // selectedTrinket === t ? "" : "brightness-50"
                      )}
                    />
                  ) : (
                    <Image
                      src="/images/empty-trinket.png"
                      alt={t.name}
                      width={160}
                      height={160}
                      className={cn(
                        selectedTrinket === t ? "" : "brightness-50 "
                      )}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-[450px] text-center">
          <div
            className={cn(
              "w-72 h-72 flex items-center justify-center bg-contain p-14 bg-no-repeat relative mx-auto",
              playerHasSelectedTrinket
                ? "bg-[url('/images/trinkets/trinket-frame.png')]"
                : ""
            )}
          >
            <div className="">
              {playerHasSelectedTrinket ? (
                <Image
                  src={selectedTrinket.image}
                  alt={selectedTrinket.name}
                  width={320}
                  height={320}
                  className="h-full w-full"
                />
              ) : (
                <Image
                  src="/images/empty-trinket.png"
                  alt="empty trinket"
                  width={320}
                  height={320}
                  className="h-full w-full"
                />
              )}
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold">
              {playerHasSelectedTrinket ? selectedTrinket.name : "???"}
            </div>

            <div className="mt-2 text-xl">
              {playerHasSelectedTrinket
                ? selectedTrinket.description
                : "You haven't unlocked this trinket yet. Level up a bunch and try to get it."}
            </div>
            {playerHasSelectedTrinket && (
              <>
                <Separator className="my-8 h-1 bg-white" />
                <div className=" text-2xl">
                  {snakeCaseToTitleCase(selectedTrinket.boostType)}s{" "}
                  {snakeCaseToTitleCase(selectedTrinket.boostedStat)} by{" "}
                  {selectedTrinket.boostValue}
                </div>
                <div className="mt-2">{selectedTrinket.effect}</div>
                <Separator className="my-8 h-1 bg-white" />

                <div className="text-center ">
                  <Button
                    disabled={togglingTrinket}
                    onClick={() => {
                      toggleTrinket(selectedTrinket.id);
                    }}
                  >
                    {togglingTrinket
                      ? "Loading"
                      : localNyla.equipped_trinket === selectedTrinket.id
                      ? "Unequip"
                      : "Equip"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isSpinningForTrinket && receivedTrinket && (
        <SpinnerV2
          trinkets={TRINKETS}
          selectedTrinketId={receivedTrinket.id}
          onDone={() => {
            setTimeout(() => {
              setIsSpinningForTrinket(false);
              setLocalNyla((prev) => ({
                ...prev,
                trinkets: [...prev.trinkets, receivedTrinket.id],
              }));
              setReceivedTrinket(null);
            }, 5000);
          }}
        />
      )}
    </Container>
  );
}
