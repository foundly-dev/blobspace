import { BlobVisualisation } from "./_components/blob-visualisation";
import { getBlobs } from "@/api";

export default async function Home() {
  const data = await getBlobs("2025-04-27");

  return (
    <main className="h-screen w-screen">
      <BlobVisualisation data={data} />
    </main>
  );
}
