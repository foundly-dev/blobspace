import { createStore } from "zustand/vanilla";

export interface BlobStore {
  hoveredSubmitters: Set<string>;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  interval: number;
  setInterval: (interval: number) => void;
}

export const createBlobStore = (initialState: BlobStore) => {
  return createStore<BlobStore>((set) => ({
    ...initialState,
    setSelectedDate: (date: string) => set({ selectedDate: date }),
    setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
    setInterval: (interval: number) => set({ interval }),
  }));
};
