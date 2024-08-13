import { languages } from "@/const";
import {
  Conversation,
  Personality,
  RemoteData,
  RemoteDataWithSetter,
  Review,
  Settings,
} from "@/type";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
export interface DataContextData {
  conversations: RemoteDataWithSetter<Conversation[]>;
  personalities: RemoteDataWithSetter<Personality[]>;
  reviews: RemoteDataWithSetter<Review[]>;
}

export const DataContext = createContext<DataContextData>({
  conversations: {
    isLoading: false,
    data: [],
    setData: () => {},
  },
  personalities: {
    isLoading: false,
    data: [],
    setData: () => {},
  },
  reviews: {
    isLoading: false,
    data: [],
    setData: () => {},
  },
});

export const useData = (): DataContextData => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error(
      "useData must be used within a corresponding ContextProvider"
    );
  }
  return context;
};
