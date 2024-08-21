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
  userId: string;
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
