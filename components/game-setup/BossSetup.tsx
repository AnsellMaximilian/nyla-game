"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import SetupItem from "@/components/game-setup/SetupItem";
import { Slider } from "@/components/ui/slider";

export default function BossSetup() {
  const [healthBoost, setHealthBoost] = useState(1);
  const [damageBoost, setDamageBoost] = useState(1);
  const [speedBoost, setSpeedBoost] = useState(1);
  const [maximumProjectiles, setMaximumProjectiles] = useState(1);
  return (
    <div className="border-primary p-8 border-[20px] rounded-md bg-slate-200 text-white bg-[url('/images/texture-wall.png')] bg-[500px] vic-font">
      <h2 className="text-3xl font-bold">Boss Setup</h2>

      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          <div className="w-[192px] h-[192px] overflow-hidden">
            <Image
              src="/images/boss-image-v3.png"
              width={192}
              height={192}
              alt="Boss"
              className="border-8 border-black"
            />
          </div>
          <h3 className="text-3xl font-semibold">Boss Name</h3>
        </div>
        <div className="text-2xl grow">
          <div className="space-y-5">
            <SetupItem label="Health Boost">
              <div className="flex items-center gap-4">
                <Slider
                  className="w-64"
                  max={3}
                  step={0.25}
                  min={1}
                  value={[healthBoost]}
                  onValueChange={(val) => setHealthBoost(val[0])}
                />
                <div>&times;{healthBoost}</div>
              </div>
            </SetupItem>
            <SetupItem label="Damage Boost">
              <div className="flex items-center gap-4">
                <Slider
                  className="w-64"
                  max={3}
                  step={0.25}
                  min={1}
                  value={[damageBoost]}
                  onValueChange={(val) => setDamageBoost(val[0])}
                />
                <div>&times;{damageBoost}</div>
              </div>
            </SetupItem>
            <SetupItem label="Speed Boost">
              <div className="flex items-center gap-4">
                <Slider
                  className="w-64"
                  max={3}
                  step={0.25}
                  min={1}
                  value={[speedBoost]}
                  onValueChange={(val) => setSpeedBoost(val[0])}
                />
                <div>&times;{speedBoost}</div>
              </div>
            </SetupItem>
            <SetupItem label="Maximum Projectiles">
              <div className="flex items-center gap-4">
                <Slider
                  className="w-64"
                  max={5}
                  step={1}
                  min={1}
                  value={[maximumProjectiles]}
                  onValueChange={(val) => setMaximumProjectiles(val[0])}
                />
                <div>{maximumProjectiles} projectiles</div>
              </div>
            </SetupItem>
            <SetupItem label="Projectile Lifetime">Test</SetupItem>
            <SetupItem label="Projectile Bounce">Test</SetupItem>
          </div>
        </div>
      </div>
      <Button>Proceed</Button>
    </div>
  );
}
