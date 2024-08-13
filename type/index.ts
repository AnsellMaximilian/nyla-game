import { Models } from "appwrite";
import { FlagComponent } from "country-flag-icons/react/3x2";
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

export type Conversation = Models.Document & {
  title: string;
  description: string;
  prompt: string;
  goal: string;
  userConversation?: UserConversation;
};

export enum SenderType {
  USER = "USER",
  BOT = "BOT",
}

export type Message = Models.Document & {
  textContent: string;
  senderId: string;
  senderType: SenderType;
  userConversationId: string;
  translation: string | null;
} & MessageFeedback;

export type MessageFeedback = {
  mistakes?: string;
  correctedText?: string;
  explanation?: string;
  feedback?: string;
};

export type UserConversation = Models.Document & {
  userId: string;
  language: string;
  personalityId: string;
  isComplete: boolean;
  conversationId: string;
  prompt: string;
  personalityImage: string;
};

export type Personality = Models.Document & {
  name: string;
  description: string;
  prompt: string;
  persona: string;
  imageUrl: string;
  traits: string;
};

export type Language = {
  locale: string;
  readableName: string;
  flag: FlagComponent;
};

export type Settings = {
  language: Language;
};

export type RemoteData<T> = {
  data: T;
  isLoading: boolean;
};

export type RemoteDataWithSetter<T> = RemoteData<T> & {
  setData: Dispatch<SetStateAction<RemoteData<T>>>;
};

export type GeminiMessageResponse = {
  message: string;
  isGoalReached: boolean;
  translation: null | string;
} & MessageFeedback;

export type CreateChatRequestBody = {
  userConversationId: string;
  personalityId: string;
  messageId?: string;
};

export type CreateChatResponseBody = {
  userMessage: Message | null;
  botMessage: Message;
  updatedUserConversation: UserConversation;
};

export type Review = Models.Document & {
  userId: string;
  language: string;
  reviewJSON: string;
  reviewValue?: ReviewJSON;
};

export type ReviewJSON = {
  summary: string;
  vocabulary: ReviewItem;
  grammar: ReviewItem;
  spelling: ReviewItem;
};

export type ReviewItem = {
  review: string;
  score: number;
};

export type CreateReviewRequestBody = {
  userId: string;
  language: string;
};

export type CreateReviewResponseBody = {
  review: Review;
  language: string;
};

export type MessageForReview = {
  text: string;
  mistakes: string | null;
  correctedText: string | null;
};
