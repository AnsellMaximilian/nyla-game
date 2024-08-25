"use client";

import React, { useEffect, useState } from "react";
import GameRenderer from "./GameRenderer";
import GameSetup from "./GameSetup";
import { BossParams, ClientPlayerNyla, Email, PlayerNyla } from "@/type";
import axios from "axios";
import { Button } from "../ui/button";
import Container from "../Container";
import Image from "next/image";
import { cn } from "@/lib/utils";
import EmailLocked from "../animation/EmailLocked";
import HomeButton from "../HomeButton";
import { getDefaultBossParams } from "@/utils/boss";
import { redirect, useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

export default function GameComponent() {
  const [bossParams, setBossParams] = useState<null | BossParams>(null);
  const [nyla, setNyla] = useState<ClientPlayerNyla | null>(null);
  const [latestUnreadEmails, setLatestUnreadEmails] = useState<Email[]>([]);
  const [ready, setReady] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState("");
  const [emailLockedAnimationDone, setEmailLockedAnimationDone] =
    useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const nylaRes = await axios.get("/api/nylas/get-nyla");

        const nyla = nylaRes.data as ClientPlayerNyla;

        const emailsRes = await axios.get("/api/nylas/get-emails", {
          params: {
            limit: 5,
            unread: true,
          },
        });

        const emails = emailsRes.data as Email[];

        setNyla(nyla);

        setLatestUnreadEmails(emails);

        setIsLoading(false);
      } catch (error) {
        toast({
          title: "Error fetching emails",
          description: "Please try again",
        });
        router.push("/");
      }
    })();
  }, []);

  const selectedEmail = latestUnreadEmails.find(
    (e) => selectedEmailId === e.id
  );

  if (isLoading) {
    return (
      <div className="vic-font text-6xl fixed flex items-center justify-center inset-0 text-white">
        <div>Loading Unread Emails...</div>
      </div>
    );
  }

  if (!ready && latestUnreadEmails.length > 0) {
    return (
      <div className="relative">
        <HomeButton className="mb-4" />
        <Container>
          <div className="mb-4 text-4xl text-white font-bold">
            Unread Emails
          </div>
          <div className="text-xl flex flex-col gap-4 max-w-full overflow-x-hidden overflow-y-hidden">
            {latestUnreadEmails.map((email) => {
              return (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmailId(email.id)}
                  className={cn(
                    "flex text-black cursor-pointer hover:scale-105 origin-top-left brightness-75",
                    selectedEmailId === email.id ? "brightness-100" : ""
                  )}
                >
                  <Image
                    src="/images/email.png"
                    width={120}
                    height={90}
                    alt="Email"
                  />
                  <div className="bg-[url('/images/paper-texture.png')] p-4 rounded-r-md overflow-hidden">
                    <div>{email.subject}</div>
                    <div>- {email.from[0]?.email}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-right mt-8">
            <Button
              className="text-2xl px-8 py-6 "
              disabled={!selectedEmail}
              onClick={() => setReady(true)}
            >
              Read Email?
            </Button>
          </div>
        </Container>
      </div>
    );
  } else if (!ready && latestUnreadEmails.length <= 0) {
    return <div>You have no unread emails.</div>;
  } else if (!emailLockedAnimationDone) {
    return (
      <EmailLocked
        onDone={() => {
          setEmailLockedAnimationDone(true);
        }}
      />
    );
  } else {
    return nyla && selectedEmail ? (
      <>
        {bossParams ? (
          <GameRenderer
            bossParams={bossParams}
            nyla={nyla}
            email={selectedEmail}
          />
        ) : (
          <GameSetup setBossParams={setBossParams} email={selectedEmail} />
        )}
      </>
    ) : (
      <div>Error Fetching your Nyla</div>
    );
  }
}
