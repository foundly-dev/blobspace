import dates from "./data.json";

export interface BlobData {
  blob_submitter: string;
  blobs: number;
  time: string;
}

export const getBlobs = async (date: string): Promise<BlobData[]> => {
  const blobs = await import(`./${date}.json`);
  return blobs.result.rows;
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
