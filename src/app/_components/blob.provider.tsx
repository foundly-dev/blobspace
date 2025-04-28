"use client";

import { ReactNode, useContext } from "react";

import { useRef } from "react";

import { createContext } from "react";
import { createBlobStore } from "./blob.store";
import { useStore } from "zustand";
import { getLatestDate } from "@/api";

export type BlobStoreApi = ReturnType<typeof createBlobStore>;

export const BlobStoreContext = createContext<BlobStoreApi | null>(null);

export const BlobProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<BlobStoreApi | null>(null);

  storeRef.current ??= createBlobStore({
    hoveredSubmitters: new Set(),
    isPlaying: false,
    setIsPlaying: () => {},
    selectedDate: getLatestDate(),
    setSelectedDate: () => {},
    interval: 500,
    setInterval: () => {},
  });

  return (
    <BlobStoreContext.Provider value={storeRef.current}>
      {children}
    </BlobStoreContext.Provider>
  );
};

export const useBlobStore = () => {
  const store = useContext(BlobStoreContext);
  if (!store) {
    throw new Error("useBlobStore must be used within a BlobStoreProvider");
  }
  return useStore(store);
};
