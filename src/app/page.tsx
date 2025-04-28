import { BlobVisualisation } from "./_components/blob-visualisation";
import { Controls } from "./_components/controls";
import { BlobProvider } from "./_components/blob.provider";

export default async function Home() {
  return (
    <main className="h-screen w-screen">
      <BlobProvider>
        <BlobVisualisation />
        <Controls />
      </BlobProvider>
    </main>
  );
}
