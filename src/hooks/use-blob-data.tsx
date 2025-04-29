import { getBlobs, getDates } from "@/api";
import { useBlobStore } from "@/app/_components/blob.provider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

export const useBlobData = () => {
  const { selectedDate } = useBlobStore();
  const queryClient = useQueryClient();

  // Prefetches the next 10 dates from available dates
  React.useEffect(() => {
    const prefetchNextDates = async () => {
      const availableDates = getDates();
      const currentIndex = availableDates.findIndex(
        (date) => date === selectedDate
      );

      const promises = Array.from({ length: 10 }, (_, i) => {
        const nextIndex = (currentIndex + i + 1) % availableDates.length;
        const nextDate = availableDates[nextIndex];

        return queryClient.prefetchQuery({
          queryKey: ["blobs", nextDate],
          queryFn: () => getBlobs(nextDate),
        });
      });

      await Promise.all(promises);
    };

    prefetchNextDates();
  }, [selectedDate, queryClient]);

  const query = useQuery({
    queryKey: ["blobs", selectedDate],
    queryFn: () => getBlobs(selectedDate),
    placeholderData: (keepPreviousData) => keepPreviousData,
  });

  return query;
};
