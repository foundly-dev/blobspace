export const getBlobs = async (date: string) => {
  const blobs = await import(`./${date}.json`);
  return blobs.result.rows;
};
