"use client";

import Game from "@/models/Game";
import {
  BossParams,
  ClientPlayerNyla,
  Email,
  GameResult,
  PlayerNyla,
} from "@/type";
import { getDefaultBossParams } from "@/utils/boss";
import axios from "axios";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { calculateLevelFromXP, calculateXPForLevel } from "@/utils/leveling";
import { Button, buttonVariants } from "@/components/ui/button";
import EmailView from "../email/EmailView";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { redirect, useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { extractStringFromEmailBody } from "@/utils/common";

export default function GameRenderer({
  bossParams,
  email,
  nyla,
}: {
  bossParams: BossParams;
  nyla: ClientPlayerNyla;
  email: Email;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const [updatedNyla, setUpdatedNyla] = useState<ClientPlayerNyla | null>(null);
  const [handlingWin, setHandlingWin] = useState(false);
  const [isPurrifyingEmail, setIsPurrifyingEmail] = useState(false);
  const [purrifiedEmailBody, setPurrifiedEmailBody] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        if (gameResult?.isWin) {
          setHandlingWin(true);
          const res = await axios.post("/api/nylas/handle-win", {
            bossParams,
          });
          const updatedNyla = res.data as ClientPlayerNyla;

          setUpdatedNyla(updatedNyla);
          setHandlingWin(false);

          setIsPurrifyingEmail(true);
          const purrRes = await axios.post("/api/nylas/purrify-email", {
            emailBody: extractStringFromEmailBody(email.body),
          });
          const purrEmail = purrRes.data as { purrifiedEmail: string };

          // marking email as read
          try {
            await axios.post("/api/nylas/read-email", {
              emailId: email.id,
            });
          } catch (error) {
            toast({
              title: "Failed to mark email as read",
              description: "Don't worry, you still got your xp.",
            });
          }
          setPurrifiedEmailBody(purrEmail.purrifiedEmail);
          setIsPurrifyingEmail(false);
        }
      } catch (error) {
        toast({
          title: "Error fetching emails",
          description: "Please try again",
        });
        router.push("/");
      } finally {
        setIsPurrifyingEmail(false);
        setHandlingWin(false);
      }
    })();
  }, [gameResult]);

  useLayoutEffect(() => {
    let game: Game;
    let frameId: number;

    (async () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = 1000;
        canvas.height = 500;

        const ctx = canvas.getContext("2d")!;
        await Game.prepareAssets();
        game = new Game(
          canvas.width,
          canvas.height,
          ctx,
          bossParams,
          nyla as PlayerNyla,
          setGameResult
        );
        // game.animate();
        let lastTime = 0;

        const animate = (timeStamp: number) => {
          const deltaTime = timeStamp - lastTime;
          lastTime = timeStamp;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          game.update(deltaTime);
          game.draw();
          if (!game.gameOver) {
            frameId = requestAnimationFrame(animate);
          }
        };

        animate(0);
      }
    })();

    return () => {
      cancelAnimationFrame(frameId);
      if (game) game.cleanUp();
    };
  }, [canvasRef]);
  return (
    <div className=" grow text-white flex items-center justify-center">
      <div className="flex gap-8">
        <canvas ref={canvasRef} className=" border-black border-4"></canvas>
      </div>
      <Dialog open={!!gameResult}>
        <DialogContent className="bgxx-[#BCCxxxDFF] text-primxxxary vic-font max-w-full w-[750px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-4xl">
              {gameResult?.isWin
                ? "Email Boss Felled! Happy Reading!"
                : "Better luck next time!"}
            </DialogTitle>
            <DialogDescription className="text-2xl">
              {gameResult?.isWin
                ? "Nice job. You received some xp."
                : "Try upgrading your Nyla or using different trinkets."}
            </DialogDescription>
          </DialogHeader>
          <div className="text-xl ">
            <div className="mb-8">
              <div className="font-semibold">
                Level{" "}
                {calculateLevelFromXP(updatedNyla ? updatedNyla.xp : nyla.xp)}
              </div>
              <div className="border-border border-4 h-4 rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{
                    width: `${
                      ((updatedNyla ? updatedNyla.xp : nyla.xp) /
                        calculateXPForLevel(
                          calculateLevelFromXP(nyla.xp) + 1
                        )) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="text-sm font-bold">
                {updatedNyla ? updatedNyla.xp : nyla.xp}/
                {calculateXPForLevel(calculateLevelFromXP(nyla.xp) + 1)}
              </div>
            </div>
            <div className="">
              {gameResult?.isWin && (
                <EmailView
                  email={email}
                  purrifiedVersion={purrifiedEmailBody}
                  isPurrifying={isPurrifyingEmail}
                />
              )}
            </div>

            <div className="mt-4 text-right">
              {handlingWin ? (
                <Button disabled>Loading...</Button>
              ) : (
                <Link href="/nyla" className={cn(buttonVariants({}))}>
                  Continue
                </Link>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
