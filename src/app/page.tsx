import { BlobVisualisation } from "./_components/blob-visualisation";
import { Controls, TabSelect } from "./_components/controls";
import { BlobProvider } from "./_components/blob.provider";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TreemapVisualisation } from "./_components/treemap-visualisation";

export default async function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <BlobProvider>
        <Tabs defaultValue="treemap">
          <div className="z-[60]">
            <Controls />
          </div>

          <div className="flex flex-row items-center justify-between pt-20 px-4 z-50">
            <p className="text-sm block md:hidden">
              <span className="font-bold">Blobs Posted Daily</span>
            </p>

            <p className="text-sm hidden md:block">
              <span className="font-bold">
                Blobs Posted Since Dencun (Daily).{" "}
              </span>
              <span className="text-muted-foreground">
                Data supplied by{" "}
                <a
                  href="https://dune.com/hildobby/blobs"
                  target="_blank"
                  className="underline"
                >
                  Hildobby&apos;s Ethereum Blobs Dashboard
                </a>
              </span>
            </p>

            <TabSelect className="flex md:hidden" />
          </div>

          <TabsContent value="blobs">
            <BlobVisualisation />
          </TabsContent>

          <TabsContent value="treemap">
            <TreemapVisualisation />
          </TabsContent>
        </Tabs>
      </BlobProvider>
    </main>
  );
}
