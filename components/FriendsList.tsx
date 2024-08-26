"use client";

import {
  Friend,
  NylasResponse,
  PlayerNyla,
  SendEmailRequestBody,
} from "@/type";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import Container from "./Container";
import FriendItem from "./FriendItem";
import Link from "next/link";
import { Button } from "./ui/button";

export default function FriendsList({
  nyla,
  invitedEmails,
}: {
  nyla: PlayerNyla;
  invitedEmails: string[];
}) {
  const [currentPageToken, setCurrentPageToken] = useState<null | string>(null);
  const [pageTokens, setPageTokens] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFriendsList, setCurrentFriendsList] = useState<Friend[]>([]);
  const [isInviting, setIsInviting] = useState(false);
  const [localInvitedEmails, setLocalInvitedEmails] = useState(invitedEmails);

  const { toast } = useToast();
  const router = useRouter();

  const getFriends = async (page_token?: string) => {
    (async () => {
      try {
        setIsLoading(true);

        const friendsRes = await axios.get("/api/nylas/get-friends", {
          params: {
            page_token: page_token,
          },
        });

        const friends = friendsRes.data as NylasResponse<Friend>;
        const cursor = friends.next_cursor;

        setCurrentPageToken(page_token ? page_token : null);

        if (cursor && !pageTokens.includes(cursor)) {
          setPageTokens((prev) => {
            if (prev.includes(cursor)) return prev;
            return [...prev, cursor];
          });
        }

        setCurrentFriendsList(friends.data);
      } catch (error) {
        toast({
          title: "Error fetching contacts",
          description: "Please try again",
        });

        router.push("/friends");
      } finally {
        setIsLoading(false);
      }
    })();
  };

  useEffect(() => {
    getFriends();
  }, []);

  const currentIndex = currentPageToken
    ? pageTokens.indexOf(currentPageToken)
    : -1;

  const prevToken = currentIndex > 0 ? pageTokens[currentIndex - 1] : undefined;

  const nextToken =
    currentIndex < pageTokens.length - 1
      ? pageTokens[currentIndex + 1]
      : undefined;

  const invite = async (email: string) => {
    setIsInviting(true);
    const body: SendEmailRequestBody = {
      body: `Head over to https://nylathecat.vercel.app
      
      Level up and upgrade your own Nyla and collect unique trinkets!
      `,
      subject: "Join me in playing Nyla the Cat!",
      to: [{ email: email, name: email }],
    };
    const res = await axios.post("/api/nylas/send-email", body);

    const inviteResult = res.data as { success: boolean };

    console.log({ inviteResult });

    if (!inviteResult.success) {
      toast({
        title: "Error inviting",
        variant: "destructive",
      });
    } else {
      setLocalInvitedEmails((prev) => [...prev, email]);
      toast({
        title: `Invitation sent to ${email}`,
      });
    }

    setIsInviting(false);
  };

  return (
    <Container>
      <header className="flex justify-between mb-8">
        <h1 className="text-4xl font-bold ">Friends</h1>
      </header>
      <div className="mb-4 min-h-[300px]">
        {isLoading ? (
          <div className="h-full flex justify-center items-center font-vic">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3  gap-2 text-lg">
            {currentFriendsList.map((f) => (
              <FriendItem
                key={f.email}
                friend={f}
                hasBeenInvited={
                  localInvitedEmails.includes(f.email) || isInviting
                }
                invite={invite}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-4 justify-end">
        <Button
          disabled={currentPageToken === null || isLoading}
          onClick={() => {
            getFriends(prevToken);
          }}
        >
          Prev
        </Button>
        <Button
          disabled={!!!nextToken || isLoading}
          onClick={() => {
            getFriends(nextToken);
          }}
        >
          Next
        </Button>
      </div>
    </Container>
  );
}
