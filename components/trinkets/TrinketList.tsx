"use client";

import React, { useState } from "react";
import Container from "@/components/Container";
import { TRINKETS } from "@/const/trinkets";
import Image from "next/image";
import { PlayerNyla, Trinket } from "@/type";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { hasBeenADaySince, timeUntilNextSpin } from "@/utils/common";
import { LoaderPinwheel } from "lucide-react";
import axios from "axios";
import Spinner from "./Spinner";

export default function TrinketList({ nyla }: { nyla: PlayerNyla }) {
  const [selectedTrinket, setSelectedTrinket] = useState<Trinket>(TRINKETS[0]);
  const [isSpinningForTrinket, setIsSpinningForTrinket] = useState(false);
  const [receivedTrinket, setReceivedTrinket] = useState<null | Trinket>(null);
  const [spinLoading, setSpinLoading] = useState(false);

  const [localNyla, setLocalNyla] = useState(nyla);

  const playerHasSelectedTrinket = localNyla.trinkets.includes(
    selectedTrinket.id
  );

  const spin = async () => {
    setSpinLoading(true);
    const res = await axios.post("/api/nylas/spin-trinket");

    const spinResult = res.data as {
      updatedPlayerNyla: PlayerNyla;
      receivedTrinket: Trinket;
    };

    setSpinLoading(false);

    setIsSpinningForTrinket(true);
    setReceivedTrinket(spinResult.receivedTrinket);
    setLocalNyla((prev) => ({
      ...prev,
      last_trinket_spin: spinResult.updatedPlayerNyla.last_trinket_spin,
    }));
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
      <div className="flex gap-8 min-h-[600px] items-start h-[1024px] ">
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
          </div>
        </div>
      </div>

      {isSpinningForTrinket && receivedTrinket && (
        <Spinner
          trinkets={TRINKETS}
          selectedTrinketId={receivedTrinket.id}
          onDone={() => {
            setIsSpinningForTrinket(false);
            setLocalNyla((prev) => ({
              ...prev,
              trinkets: [...prev.trinkets, receivedTrinket.id],
            }));
            setReceivedTrinket(null);
          }}
        />
      )}
    </Container>
  );
}
