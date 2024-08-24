"use client";

import React, { useState } from "react";
import Container from "@/components/Container";
import { TRINKETS } from "@/const/trinkets";
import Image from "next/image";
import { ClientPlayerNyla, PlayerNyla, Trinket } from "@/type";
import { cn } from "@/lib/utils";

export default function TrinketList({ nyla }: { nyla: PlayerNyla }) {
  const [selectedTrinket, setSelectedTrinket] = useState<Trinket>(TRINKETS[0]);

  const playerHasSelectedTrinket = nyla.trinkets.includes(selectedTrinket.id);
  return (
    <Container>
      <h1 className="text-4xl font-bold mb-4">Trinkets</h1>
      <div className="flex gap-8 min-h-[600px] items-start h-[1024px] ">
        <div className="gap-4 flex flex-wrap justify-between">
          {TRINKETS.map((t) => {
            const playerHasTrinket = nyla.trinkets.includes(t.id);
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
              "w-72 h-72 flex items-center justify-center bg-contain p-8 bg-no-repeat relative mx-auto",
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
    </Container>
  );
}
