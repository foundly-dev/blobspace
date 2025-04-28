import { createStore } from "zustand/vanilla";
import { KnownSubmitters } from "./blob-info";

export interface BlobStore {
  selectedSubmitter: KnownSubmitters | null;
  setSelectedSubmitter: (submitter: KnownSubmitters | null) => void;
  hoveredSubmitters: Set<string>;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}

export const createBlobStore = (initialState: BlobStore) => {
  return createStore<BlobStore>((set) => ({
    ...initialState,
    setSelectedDate: (date: string) => set({ selectedDate: date }),
    setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  }));
};
