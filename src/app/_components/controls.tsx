"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CircleDotDashed, Pause, Play, Radio } from "lucide-react";
import { getDates } from "@/api";
import { useBlobStore } from "./blob.provider";
import { useInterval } from "usehooks-ts";

const dates = getDates();
const count = dates.length;

export const Controls = () => {
  const { selectedDate, setSelectedDate, isPlaying, setIsPlaying } =
    useBlobStore();

  const onValueChange = (value: number[]) => {
    setSelectedDate(dates[value[0]]);
  };

  const onSetLive = () => {
    setSelectedDate(dates[count - 1]);
  };

  useInterval(() => {
    if (isPlaying) {
      const currentIndex = dates.indexOf(selectedDate);
      const nextIndex = (currentIndex + 1) % count;
      setSelectedDate(dates[nextIndex]);
    }
  }, 500);

  return (
    <div className="absolute top-4 left-4 right-4 z-50 flex items-center flex-col md:flex-row gap-4">
      <div className="flex md:flex-col gap-0.5 items-end md:items-start justify-between w-full md:w-fit px-2 md:px-0">
        <div className="flex items-center">
          <span className="inline mr-1 bg-foreground p-1 rounded">
            <CircleDotDashed className="text-background size-3" />{" "}
          </span>
          <span className="font-black font-pt-mono">
            blobspace
            <span className="text-muted-foreground font-medium">.fun</span>
          </span>
        </div>

        <a
          href="https://x.com/0xmfbevan"
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="text-sm text-muted-foreground">
            by <span className="font-medium underline">mfbevan</span>
          </p>
        </a>
      </div>

      <div className="flex items-center w-full gap-4 p-2 bg-white/50 rounded-lg shadow">
        {
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="size-3" fill="currentColor" />
            ) : (
              <Play className="size-3" fill="currentColor" />
            )}
          </Button>
        }
        <Slider
          min={0}
          max={count - 1}
          step={1}
          value={[dates.indexOf(selectedDate)]}
          onValueChange={onValueChange}
          className="w-full"
        />
        <p className="text-sm min-w-fit line-clamp-1">{selectedDate}</p>
        {/* <Button variant="outline" size="sm" onClick={onSetLive}>
          <Radio className="mr-2 h-4 w-4" />
          Live
        </Button> */}
      </div>
    </div>
  );
};
