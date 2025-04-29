import { BlobVisualisation } from "./_components/blob-visualisation";
import { Controls } from "./_components/controls";
import { BlobProvider } from "./_components/blob.provider";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TreemapVisualisation } from "./_components/treemap-visualisation";

export default async function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <BlobProvider>
        <Tabs defaultValue="blobs">
          <Controls />

          <TabsContent value="blobs">
            <BlobVisualisation />
          </TabsContent>

          <TabsContent value="treemap" className="pt-18">
            <TreemapVisualisation />
          </TabsContent>
        </Tabs>
      </BlobProvider>
    </main>
  );
}
