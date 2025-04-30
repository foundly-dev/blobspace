import dates from "./dates.json";

export interface BlobData {
  blob_submitter: string;
  blobs: number;
  time: string;
}

export const getBlobs = async (
  date: string
): Promise<{ blobs: BlobData[]; total: number }> => {
  const blobs = await import(`./data/${date}.json`).then((module) => {
    return module.default;
  });
  const total = blobs.reduce(
    (acc: number, curr: BlobData) => acc + curr.blobs,
    0
  );
  return { blobs, total };
};

export const getDates = () => {
  const uniqueDates = [...new Set(dates)];
  return uniqueDates.sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });
};

export const getLatestDate = () => {
  const dates = getDates();
  return dates[dates.length - 1];
};
