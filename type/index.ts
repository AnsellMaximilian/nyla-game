import { SetupNames } from "@/const/boss-setup";
import { PlayerStatNames } from "@/const/player";
import { Models } from "appwrite";
import { JWTPayload } from "jose";
import { Dispatch, SetStateAction } from "react";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
};

export type UserProfile = Models.Document & {
  username: string;
  name?: string;
  bio?: string;
  currentLanguage: string;
};

export type User = Models.User<Models.Preferences> & {
  profile: UserProfile;
};

export enum SenderType {
  USER = "USER",
  BOT = "BOT",
}

export type RemoteData<T> = {
  data: T;
  isLoading: boolean;
};

export type RemoteDataWithSetter<T> = RemoteData<T> & {
  setData: Dispatch<SetStateAction<RemoteData<T>>>;
};

export type SessionPayload = {
  grantRecordId: string;
  expiresAt: Date;
};

export type GrantRecord = Models.Document & {
  grant_id: string;
  access_token: string;
  refresh_token: string;
  email: string;
  scope: string;
  token_type: string;
  id_token: string;
};

export type PlayerNyla = Models.Document & {
  grant_id: string;
  email: string;
  trinkets: string[];
  xp: number;
  additiona_attack_multiplier: number;
  additional_hearts: number;
  additional_nyla_blast_damage: number;
};

export type ClientPlayerNyla = Omit<PlayerNyla, "$id">;

export type SessionData = JWTPayload & SessionPayload;

export type DetailedImage = {
  img: CanvasImageSource;
  width: number;
  height: number;
};

export type GameResult = {
  isWin: boolean;
};

export type SetupValues = {
  max: number;
  default: number;
  min: number;
  step: number;
};

export type BossParams = {
  healthBoost: number;
  speedBoost: number;
  attackSpeedBoost: number;
  maxProjectiles: number;
  projectileLifetime: number;
  projectileBounces: boolean;
};

export type Trinket = {
  id: string;
  name: string;
  description: string;
  image: string;
  boostedStat: keyof typeof PlayerStatNames;
  boostValue: number;
  boostType: "INCREASE" | "DECREASE";
  available: boolean;
  effect: string;
};

export type Attachment = {
  id: string;
  grant_id: string;
  filename: string;
  size: number;
  content_type: string;
  is_inline?: boolean;
  content_disposition?: string;
};

export type EmailAddress = {
  name: string;
  email: string;
};

export type Email = {
  starred: boolean;
  unread: boolean;
  folders: string[];
  grant_id: string;
  date: number;
  attachments: Attachment[];
  from: EmailAddress[];
  id: string;
  object: string;
  snippet: string;
  subject: string;
  thread_id: string;
  to: EmailAddress[];
  created_at: number;
  body: string;
};

export type NylasResponse<T> = {
  request_id: string;
  data: T[];
  next_cursor: string;
};
