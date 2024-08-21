import Container from "@/components/Container";
import { TRINKETS } from "@/const/trinkets";
import Image from "next/image";
import React from "react";

export default function TrinketPage() {
  return (
    <div className="container mx-auto px-8">
      <Container>
        <h1 className="text-4xl font-bold">Trinkets</h1>
        <div className="flex gap-4">
          {TRINKETS.map((t) => {
            return (
              <div
                key={t.id}
                className=" border-primary border-[10px] rounded-md"
              >
                <div className="w-32 bg-black/40 p-4">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={320}
                    height={320}
                    className="h-full w-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
