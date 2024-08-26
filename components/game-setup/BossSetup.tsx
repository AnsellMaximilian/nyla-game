"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import SetupItem from "@/components/game-setup/SetupItem";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { SETUP_VALUES, SetupNames } from "@/const/boss-setup";
import { BossParams, Email } from "@/type";

export default function BossSetup({
  setBossParams,
  email,
}: {
  setBossParams: React.Dispatch<React.SetStateAction<BossParams | null>>;
  email: Email;
}) {
  const [attackSpeedBoost, setAttackSpeedBoost] = useState(
    SETUP_VALUES[SetupNames.ATTACK_SPEED].default
  );
  const [healthBoost, setHealthBoost] = useState(
    SETUP_VALUES[SetupNames.HEALTH].default
  );
  const [speedBoost, setSpeedBoost] = useState(
    SETUP_VALUES[SetupNames.SPEED].default
  );
  const [maxProjectiles, setMaxProjectiles] = useState(
    SETUP_VALUES[SetupNames.MAX_PROJECTILES].default
  );
  const [projectileLifetime, setProjectileLifetime] = useState(
    SETUP_VALUES[SetupNames.PROJECTILE_LIFETIME].default
  );
  const [projectileBounces, setProjectileBounces] = useState(false);

  const handleProceed = () => {
    const bossParams: BossParams = {
      attackSpeedBoost,
      speedBoost,
      healthBoost,
      maxProjectiles,
      projectileLifetime,
      projectileBounces,
    };
    setBossParams(bossParams);
  };
  return (
    <div className="border-primary p-8 border-[20px] rounded-md bg-slate-200 text-white bg-[url('/images/texture-wall.png')] bg-[500px] vic-font">
      <div className="flex gap-8">
        <div>
          <div>
            <h2 className="text-4xl font-bold">Boss Setup</h2>
            <p className="text-xl">
              Adjust the Email Boss&apos; difficulty for more Experience
            </p>
          </div>
          <div className="flex gap-8 mt-4">
            <div className="flex flex-col gap-2 max-w-[500px]">
              <div className="w-[192px] h-[192px] overflow-hidden">
                <Image
                  src="/images/boss-image-v3.png"
                  width={192}
                  height={192}
                  alt="Boss"
                  className="border-8 border-black"
                />
              </div>
              <h3 className="text-3xl font-semibold">{email.subject}</h3>
            </div>
            <div className="text-2xl grow">
              <div className="space-y-5">
                <SetupItem label="Health Boost">
                  <div className="flex items-center gap-4">
                    <Slider
                      className="w-64"
                      max={SETUP_VALUES[SetupNames.HEALTH].max}
                      step={SETUP_VALUES[SetupNames.HEALTH].step}
                      min={SETUP_VALUES[SetupNames.HEALTH].min}
                      value={[healthBoost]}
                      onValueChange={(val) => setHealthBoost(val[0])}
                    />
                    <div>&times;{healthBoost}</div>
                  </div>
                </SetupItem>
                <SetupItem label="Attack Speed Boost">
                  <div className="flex items-center gap-4">
                    <Slider
                      className="w-64"
                      max={SETUP_VALUES[SetupNames.ATTACK_SPEED].max}
                      step={SETUP_VALUES[SetupNames.ATTACK_SPEED].step}
                      min={SETUP_VALUES[SetupNames.ATTACK_SPEED].min}
                      value={[attackSpeedBoost]}
                      onValueChange={(val) => setAttackSpeedBoost(val[0])}
                    />
                    <div>&times;{attackSpeedBoost}</div>
                  </div>
                </SetupItem>
                <SetupItem label="Move Speed Boost">
                  <div className="flex items-center gap-4">
                    <Slider
                      className="w-64"
                      max={SETUP_VALUES[SetupNames.SPEED].max}
                      step={SETUP_VALUES[SetupNames.SPEED].step}
                      min={SETUP_VALUES[SetupNames.SPEED].min}
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
                      max={SETUP_VALUES[SetupNames.MAX_PROJECTILES].max}
                      step={SETUP_VALUES[SetupNames.MAX_PROJECTILES].step}
                      min={SETUP_VALUES[SetupNames.MAX_PROJECTILES].min}
                      value={[maxProjectiles]}
                      onValueChange={(val) => setMaxProjectiles(val[0])}
                    />
                    <div>{maxProjectiles} projectiles</div>
                  </div>
                </SetupItem>
                <SetupItem label="Projectile Lifetime">
                  <div className="flex items-center gap-4">
                    <Slider
                      className="w-64"
                      max={SETUP_VALUES[SetupNames.PROJECTILE_LIFETIME].max}
                      step={SETUP_VALUES[SetupNames.PROJECTILE_LIFETIME].step}
                      min={SETUP_VALUES[SetupNames.PROJECTILE_LIFETIME].min}
                      value={[projectileLifetime]}
                      onValueChange={(val) => setProjectileLifetime(val[0])}
                    />
                    <div>{projectileLifetime / 1000} seconds</div>
                  </div>
                </SetupItem>
                <SetupItem label="Projectile Bounce">
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={projectileBounces}
                      onCheckedChange={(val) => setProjectileBounces(val)}
                    />

                    <div>{projectileBounces ? "Yes" : "No"}</div>
                  </div>
                </SetupItem>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex mt-8">
        <div className="ml-auto space-y-4 text-right">
          <div className="text-4xl mt-auto">Exp Boost: &times;23</div>

          <Button className="text-3xl px-8 py-8" onClick={handleProceed}>
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
}
