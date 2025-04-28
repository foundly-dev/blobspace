import { createStore } from "zustand/vanilla";

export interface BlobStore {
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
