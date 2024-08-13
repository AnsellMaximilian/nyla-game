import { account, config, databases } from "@/lib/appwrite";
import { ReactNode, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Conversation,
  Personality,
  RemoteData,
  Review,
  Settings,
  User,
  UserConversation,
  UserProfile,
} from "@/type";
import { languages } from "@/const";
import { DataContext } from "./DataContext";
import {
  getDefaultRemoteData,
  getRemoteDataWithSetter,
  setRemoteDataLoading,
} from "@/utils/common";
import { useSettings } from "../settings/SettingsContext";
import { Query } from "appwrite";

export const DataContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [conversations, setConversations] = useState<
    RemoteData<Conversation[]>
  >(getDefaultRemoteData([]));
  const [personalities, setPersonalities] = useState<RemoteData<Personality[]>>(
    getDefaultRemoteData([])
  );

  const [reviews, setReviews] = useState<RemoteData<Review[]>>(
    getDefaultRemoteData([])
  );

  const { settings } = useSettings();

  useEffect(() => {
    (async () => {
      setRemoteDataLoading(setPersonalities, true);
      setRemoteDataLoading(setReviews, true);

      const resPersonalities = await databases.listDocuments(
        config.dbId,
        config.personalityCollectionId
      );

      const resReviews = await databases.listDocuments(
        config.dbId,
        config.reviewCollectionId
      );

      const personalities = resPersonalities.documents as Personality[];
      const reviews = resReviews.documents as Review[];

      setPersonalities((prev) => ({
        ...prev,
        data: personalities,
      }));

      setReviews((prev) => {
        const review = {
          ...prev,
          data: reviews.map((r) => {
            try {
              r.reviewValue = JSON.parse(r.reviewJSON);
            } catch (error) {}
            return r;
          }),
        };

        return review;
      });

      setRemoteDataLoading(setPersonalities, false);
      setRemoteDataLoading(setReviews, false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setRemoteDataLoading(setConversations, true);

      const resConvos = await databases.listDocuments(
        config.dbId,
        config.conversationCollectionId,

        [Query.limit(50)]
      );

      const resUserConvos = await databases.listDocuments(
        config.dbId,
        config.userConversationCollectionId,
        [Query.equal("language", settings.language.locale)]
      );

      const conversations = resConvos.documents as Conversation[];
      const userConversations = resUserConvos.documents as UserConversation[];

      setConversations((prev) => ({
        ...prev,
        data: conversations.map((convo) => ({
          ...convo,
          userConversation: userConversations.find(
            (uc) => uc.conversationId === convo.$id
          ),
        })),
      }));

      setRemoteDataLoading(setConversations, false);
    })();
  }, [settings.language]);

  return (
    <DataContext.Provider
      value={{
        conversations: getRemoteDataWithSetter<Conversation[]>(
          conversations,
          setConversations
        ),
        personalities: getRemoteDataWithSetter<Personality[]>(
          personalities,
          setPersonalities
        ),
        reviews: getRemoteDataWithSetter<Review[]>(reviews, setReviews),
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
