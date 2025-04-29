"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CircleDotDashed, Grid2x2, Pause, Play, Timer } from "lucide-react";
import { getDates } from "@/api";
import { useBlobStore } from "./blob.provider";
import { useInterval } from "usehooks-ts";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const dates = getDates();
const count = dates.length;

export const Controls = () => {
  const {
    selectedDate,
    setSelectedDate,
    isPlaying,
    setIsPlaying,
    interval,
    setInterval,
  } = useBlobStore();

  const onValueChange = (value: number[]) => {
    setSelectedDate(dates[value[0]]);
  };

  useInterval(() => {
    if (isPlaying) {
      const currentIndex = dates.indexOf(selectedDate);
      const nextIndex = (currentIndex + 1) % count;
      setSelectedDate(dates[nextIndex]);
    }
  }, interval);

  return (
    <div className="absolute top-4 left-4 right-4 z-50 flex gap-2 flex-col ">
      <div className="flex items-center flex-row gap-4">
        <div className="md:flex-col gap-0.5 items-end md:items-start justify-between w-full md:w-fit px-2 md:px-0 hidden md:flex">
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

        <div className="md:flex hidden items-center">
          <About>
            <div className="rounded-full p-3 hover:bg-accent transition-colors"></div>
          </About>
        </div>

        <div className="flex items-center md:hidden">
          <About>
            <div className="mr-1 bg-foreground p-1 rounded">
              <CircleDotDashed className="text-background size-3" />{" "}
            </div>
          </About>
        </div>

        <div className="flex items-center w-full  p-2 bg-gray-50 rounded-lg shadow-inner">
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

          <Select
            value={interval.toString()}
            onValueChange={(value) => setInterval(parseInt(value))}
          >
            <SelectTrigger
              className="rounded-full border-none bg-none shadow-none hover:bg-accent"
              chevron={false}
            >
              <Timer className="text-primary size-3" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Interval</SelectLabel>
                <SelectItem value="1000">1 second</SelectItem>
                <SelectItem value="500">500ms</SelectItem>
                <SelectItem value="250">250ms</SelectItem>
                <SelectItem value="100">100ms</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Slider
            min={0}
            max={count - 1}
            step={1}
            value={[dates.indexOf(selectedDate)]}
            onValueChange={onValueChange}
            className="w-full mx-2"
          />
          <p className="text-sm min-w-fit line-clamp-1">{selectedDate}</p>
        </div>
      </div>

      <div className="flex self-end">
        <TabsList>
          <TabsTrigger value="blobs">
            <CircleDotDashed /> Blobs
          </TabsTrigger>
          <TabsTrigger value="treemap">
            <Grid2x2 /> Treemap
          </TabsTrigger>
        </TabsList>
      </div>
    </div>
  );
};

const About = ({ children }: { children: React.ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left">
            Welcome to{" "}
            <span className="font-black font-pt-mono">blobspace</span>
            .fun
          </DialogTitle>
          <DialogDescription className="text-left">
            This is a visualization tool for exploring blob data on Ethereum.
            Explore historical blob data since the Dencun upgrade using the
            historical timeline. Switch between the interactive blob and treemap
            views.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Created by{" "}
            <a
              href="https://x.com/0xmfbevan"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              mfbevan
            </a>
            {" at "}
            <a
              href="https://foundly.dev?utm_source=blobspace"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              foundly.dev
            </a>
          </p>

          <p className="text-sm text-muted-foreground">
            Contributions welcome{" "}
            <a
              href="https://github.com/foundly-dev/blobspace"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              foundly-dev/blobspace
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
