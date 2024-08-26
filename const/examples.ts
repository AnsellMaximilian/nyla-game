import { ClientPlayerNyla, Email, Friend, PlayerNyla } from "@/type";

export const exampleEmail: Email = {
  starred: false,
  unread: true,
  folders: ["inbox", "work"],
  date: 1692960649000, // This is equivalent to 2024-08-25T02:06:09.518+00:00 in milliseconds
  attachments: [],
  id: "email_001",
  object: "email",
  snippet: "This is a snippet of the email content...",
  subject: "Important Update",
  thread_id: "thread_001",
  to: [
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
  ],
  from: [
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
  ],
  created_at: 1692960649000, // The same timestamp as `date`
  body: "This is the full content of the email...",
};

export const examplePlayerNyla: ClientPlayerNyla = {
  $id: "player1",
  $createdAt: "2024-08-25T12:34:56.789Z",
  $updatedAt: "2024-08-25T12:34:56.789Z",
  $permissions: ["read", "write"],

  grant_id: "grant_abc123",
  email: "player@nylagame.com",
  trinkets: ["PURR_TRINITY_COLLAR", "CLAWS_OF_LIONESSA"],

  xp: 1500,
  additiona_attack_multiplier: 1.2,
  additional_hearts: 2,
  additional_nyla_blast_damage: 3.5,

  upgrades: ["ATTACK", "HEALTH", "SPEED"],

  equipped_trinkets: ["PURR_TRINITY_COLLAR"],

  last_trinket_spin: "2024-08-25T02:06:09.518+00:00",
};

export const exampleFriends: Friend[] = [
  {
    email: "catlover@example.com",
    nyla: {
      xp: 1500,
      trinkets: ["PURR_TRINITY_COLLAR", "CLAWS_OF_LIONESSA"],
      upgrades: ["ATTACK", "HEALTH"],
    },
  },
  {
    email: "meowmaster@example.com",
    nyla: {
      xp: 2300,
      trinkets: ["LAST_VERDANT_ESSENCE_OF_FELINIA"],
      upgrades: ["SPEED", "NYLA_BLAST"],
    },
  },
  {
    email: "whiskerwhiz@example.com",
    nyla: {
      xp: 3200,
      trinkets: ["ETERNAL_YARN_BALL", "SUNBEAM_SCEPTER"],
      upgrades: ["DASH_COOLDOWN", "HEALTH", "NYLA_BLAST_METER"],
    },
  },
];
