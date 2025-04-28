import { createStore } from "zustand/vanilla";

export interface BlobStore {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const createBlobStore = (initialState: BlobStore) => {
  return createStore<BlobStore>((set) => ({
    ...initialState,
    setSelectedDate: (date: string) => set({ selectedDate: date }),
  }));
};
