"use client";

import { useRef, useState, useEffect } from "react";
import { useBlobStore } from "./blob.provider";
import { getSubmitter } from "./blob-info";
import { Group } from "@visx/group";
import { Treemap, hierarchy, treemapSquarify } from "@visx/hierarchy";
import { scaleOrdinal } from "@visx/scale";
import { useBlobData } from "@/hooks/use-blob-data";
import { Spinner } from "@/components/ui/spinner";

const offset = 108;

export const TreemapVisualisation = () => {
  const { selectedDate, hoveredSubmitters } = useBlobStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [initialRender, setInitialRender] = useState(true);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1000,
    height: typeof window !== "undefined" ? window.innerHeight - offset : 600,
  });

  // Fetch blob data based on selected date
  const { data } = useBlobData();

  useEffect(() => {
    // Disable animation on first render, enable after
    if (initialRender) {
      setTimeout(() => setInitialRender(false), 100);
    }
  }, [initialRender]);

  // Add resize listener
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - offset,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Convert flat blob data to hierarchical structure for treemap
  const treeData = {
    name: "root",
    children:
      data?.blobs.map((item) => ({
        name: item.blob_submitter,
        size: item.blobs,
      })) ?? [],
  };

  // Create hierarchy from data
  const root = hierarchy(treeData)
    // @ts-expect-error -- weird
    .sum((d) => ("size" in d ? d.size : 0))
    .sort((a, b) => (b.value || 0) - (a.value || 0));

  // Replace static dimension calculations with state values
  const width = dimensions.width;
  const height = dimensions.height;

  // Create color scale for the treemap blocks
  const colorScale = scaleOrdinal({
    domain: data?.blobs.map((d) => d.blob_submitter) ?? [],
    range: data?.blobs.map((d) => getSubmitter(d.blob_submitter).color) ?? [],
  });

  const handleMouseOver = (submitter: string) => {
    hoveredSubmitters.add(submitter);
  };

  const handleMouseOut = (submitter: string) => {
    hoveredSubmitters.delete(submitter);
  };

  if (!data) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      <style jsx global>{`
        .treemap-node {
          transition: ${initialRender
            ? "none"
            : "transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1.0)"};
        }
        .treemap-rect {
          transition: ${initialRender
            ? "none"
            : "all 500ms cubic-bezier(0.2, 0.8, 0.2, 1.0)"};
        }
        .treemap-text {
          transition: ${initialRender
            ? "none"
            : "all 500ms cubic-bezier(0.2, 0.8, 0.2, 1.0)"};
        }
      `}</style>

      <svg width={width} height={height}>
        <Treemap
          root={root}
          size={[width, height]}
          tile={treemapSquarify}
          round={true}
          paddingInner={4}
          paddingOuter={8}
        >
          {(treemap) => (
            <Group>
              {treemap
                .descendants()
                .filter(
                  (node) =>
                    !node.children &&
                    node.x1 - node.x0 >= 10 &&
                    node.y1 - node.y0 >= 10
                )
                .map((node) => {
                  const submitter = node.data.name;
                  const color = colorScale(submitter);
                  const nodeWidth = node.x1 - node.x0;
                  const nodeHeight = node.y1 - node.y0;
                  const borderRadius = Math.min(nodeWidth, nodeHeight) / 24;

                  const fontSize = Math.min(nodeWidth, nodeHeight) / 8;
                  const { icon } = getSubmitter(submitter);
                  const percentage = node.value
                    ? (node.value / data.total) * 100
                    : 0;
                  return (
                    <g
                      key={`node-${submitter}-${selectedDate}`}
                      className="treemap-node"
                      transform={`translate(${node.x0}, ${node.y0})`}
                      onMouseEnter={() => handleMouseOver(submitter)}
                      onMouseLeave={() => handleMouseOut(submitter)}
                    >
                      <rect
                        className="treemap-rect transition-all duration-500"
                        width={nodeWidth}
                        height={nodeHeight}
                        fill={color}
                        rx={borderRadius}
                        ry={borderRadius}
                        stroke="#fff"
                        strokeWidth={2}
                      />

                      {nodeWidth > 40 && nodeHeight > 40 && icon && (
                        <image
                          className="blur-lg"
                          href={icon}
                          x={0}
                          y={0}
                          width={nodeWidth}
                          height={nodeHeight}
                          opacity={0.5}
                          preserveAspectRatio="xMidYMid slice"
                        />
                      )}

                      {nodeWidth > 40 && nodeHeight > 30 && (
                        <>
                          <text
                            className="treemap-text"
                            x={nodeWidth / 2}
                            y={nodeHeight / 2}
                            textAnchor="middle"
                            dy=".3em"
                            fontSize={fontSize}
                            fontFamily="Arial"
                            fontWeight="bold"
                            fill="white"
                            pointerEvents="none"
                            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                          >
                            {submitter}
                          </text>
                          <text
                            className="treemap-text"
                            x={nodeWidth / 2}
                            y={nodeHeight / 2 + fontSize * 1.2}
                            textAnchor="middle"
                            fontSize={fontSize * 0.8}
                            fontFamily="Arial"
                            fill="white"
                            pointerEvents="none"
                            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                          >
                            {node.value} ({percentage.toFixed(0)}%)
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}
            </Group>
          )}
        </Treemap>
      </svg>
    </div>
  );
};
