"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";
import { getSubmitter } from "./blob-info";
interface BlobData {
  blob_submitter: string;
  blobs: number;
  time: string;
}

interface BlobVisualizationProps {
  data: BlobData[];
}

export const BlobVisualisation = ({ data }: BlobVisualizationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine>(null);
  const renderRef = useRef<Matter.Render>(null);
  const runnerRef = useRef<Matter.Runner>(null);
  const labelsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing canvas
    containerRef.current.innerHTML = "";

    // Create labels container
    const labelsContainer = document.createElement("div");
    labelsContainer.style.position = "absolute";
    labelsContainer.style.top = "0";
    labelsContainer.style.left = "0";
    labelsContainer.style.width = "100%";
    labelsContainer.style.height = "100%";
    labelsContainer.style.pointerEvents = "none";
    containerRef.current.appendChild(labelsContainer);
    labelsContainerRef.current = labelsContainer;

    // Matter.js modules
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const Runner = Matter.Runner;
    const MouseConstraint = Matter.MouseConstraint;
    const Mouse = Matter.Mouse;
    const Composite = Matter.Composite;
    const Bodies = Matter.Bodies;
    const World = Matter.World;
    const Events = Matter.Events;

    // Create engine
    const engine = Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    // Get dimensions from container
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create renderer
    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: width,
        height: height,
        showAngleIndicator: false,
        wireframes: false,
        background: "#f0f0f0",
      },
    });
    renderRef.current = render;

    Render.run(render);

    // Create runner
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Configure circle options with different colors
    const getCircleOptions = (index: number) => {
      const { color } = getSubmitter(data[index].blob_submitter);

      return {
        friction: 0.05,
        frictionStatic: 0.1,
        restitution: 0, // Add more bounce
        render: {
          fillStyle: color,
          lineWidth: 0,
        },
      };
    };

    // Create walls function that we can reuse for resize
    const wallThickness = 50;

    const createWalls = (w: number, h: number) => {
      const halfW = w / 2;
      const halfH = h / 2;

      return [
        Bodies.rectangle(halfW, -wallThickness / 2, w, wallThickness, {
          isStatic: true,
          label: "topWall",
        }),
        Bodies.rectangle(halfW, h + wallThickness / 2, w, wallThickness, {
          isStatic: true,
          label: "bottomWall",
        }),
        Bodies.rectangle(w + wallThickness / 2, halfH, wallThickness, h, {
          isStatic: true,
          label: "rightWall",
        }),
        Bodies.rectangle(-wallThickness / 2, halfH, wallThickness, h, {
          isStatic: true,
          label: "leftWall",
        }),
      ];
    };

    // Create circles based on data
    const circles = [];
    const labelElements: HTMLDivElement[] = [];

    if (data && data.length > 0) {
      // Find the max blob value to normalize sizes
      const maxBlobValue = Math.max(...data.map((item) => item.blobs));
      const minSize = 30; // Minimum radius for smallest blob
      const maxSize = 200; // Maximum radius for largest blob

      // Calculate sizes first to plan layout
      const blobSizes = data.map((item) => {
        const blobRatio = item.blobs / maxBlobValue;
        return minSize + blobRatio * (maxSize - minSize);
      });

      // Calculate positions to prevent overlap
      const positions: { x: number; y: number }[] = [];

      // Calculate positions based on sizes to prevent overlap
      const totalItems = data.length;
      const horizontalPadding = width * 0.1; // 10% padding on each side
      const verticalPadding = height * 0.15; // 15% padding on top and bottom

      // Calculate available space
      const availableWidth = width - horizontalPadding * 2;
      const availableHeight = height - verticalPadding * 2;

      // Position calculation helpers
      const getX = (index: number) => {
        if (totalItems === 1) return width / 2;

        // More sophisticated positioning for multiple blobs
        return horizontalPadding + (availableWidth * index) / (totalItems - 1);
      };

      // Create alternating Y positions to prevent direct overlaps
      const getY = (index: number) => {
        // Create a wave pattern of positions
        const centerY = height / 2;
        const amplitude = availableHeight / 3; // Use 1/3 of available height as amplitude

        // Alternate between upper and lower positions
        if (totalItems <= 3) {
          // For 1-3 items, position them at different heights
          const positions = [
            centerY,
            centerY - amplitude * 0.8,
            centerY + amplitude * 0.8,
          ];
          return positions[index % positions.length];
        } else {
          // For more items, create a wave pattern
          return centerY + Math.sin((index * Math.PI) / 2) * amplitude * 0.7;
        }
      };

      // Calculate positions for all blobs
      for (let i = 0; i < totalItems; i++) {
        positions.push({
          x: getX(i),
          y: getY(i),
        });
      }

      // Create a circle for each data item
      data.forEach((item, index) => {
        const radius = blobSizes[index];
        const xPosition = positions[index].x;
        const yPosition = positions[index].y;

        // Create a simple circle with the calculated radius
        const circle = Bodies.circle(
          xPosition,
          yPosition,
          radius,
          getCircleOptions(index)
        );

        // Add a label with the submitter name
        circle.label = item.blob_submitter;
        circles.push(circle);

        // Create text label element
        const label = document.createElement("div");
        label.textContent = item.blob_submitter;
        label.style.position = "absolute";
        label.style.fontSize = "14px";
        label.style.fontWeight = "bold";
        label.style.color = "#fff";
        label.style.textAlign = "center";
        label.style.transform = "translate(-50%, -50%)";
        label.style.textShadow = "1px 1px 2px rgba(0,0,0,0.7)";
        label.style.pointerEvents = "none";

        labelsContainer.appendChild(label);
        labelElements.push(label);
      });
    } else {
      // Fallback to default circles if no data
      circles.push(
        Bodies.circle(width * 0.25, height * 0.3, 40, getCircleOptions(0)),
        Bodies.circle(width * 0.5, height * 0.5, 60, getCircleOptions(1)),
        Bodies.circle(width * 0.75, height * 0.7, 50, getCircleOptions(2))
      );
    }

    // Add walls
    const walls = createWalls(width, height);

    // Add all bodies to world
    World.add(world, [...circles, ...walls]);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.9,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // Update label positions on each render step
    Events.on(engine, "afterUpdate", () => {
      const bodies = Composite.allBodies(world).filter(
        (body) =>
          body.label !== "topWall" &&
          body.label !== "bottomWall" &&
          body.label !== "leftWall" &&
          body.label !== "rightWall"
      );

      // Match label positions to their bodies
      bodies.forEach((body, i) => {
        if (i < labelElements.length) {
          labelElements[i].style.left = `${body.position.x}px`;
          labelElements[i].style.top = `${body.position.y}px`;
        }
      });
    });

    // Fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: width, y: height },
    });

    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      // First, update the renderer size
      render.options.width = newWidth;
      render.options.height = newHeight;
      render.canvas.width = newWidth;
      render.canvas.height = newHeight;

      // Remove old walls
      const wallBodies = Composite.allBodies(world).filter(
        (body) =>
          body.label === "topWall" ||
          body.label === "bottomWall" ||
          body.label === "leftWall" ||
          body.label === "rightWall"
      );

      World.remove(world, wallBodies);

      // Add new walls
      const newWalls = createWalls(newWidth, newHeight);
      World.add(world, newWalls);

      // Reposition circles based on new dimensions
      const circleBodies = Composite.allBodies(world).filter(
        (body) =>
          body.label !== "topWall" &&
          body.label !== "bottomWall" &&
          body.label !== "leftWall" &&
          body.label !== "rightWall"
      );

      if (circleBodies.length > 0 && data && data.length > 0) {
        const horizontalPadding = newWidth * 0.1;
        const verticalPadding = newHeight * 0.15;
        const availableWidth = newWidth - horizontalPadding * 2;
        const availableHeight = newHeight - verticalPadding * 2;
        const totalItems = circleBodies.length;

        circleBodies.forEach((circle, index) => {
          const centerY = newHeight / 2;
          const amplitude = availableHeight / 3;

          let xPos =
            horizontalPadding + (availableWidth * index) / (totalItems - 1);
          if (totalItems === 1) xPos = newWidth / 2;

          let yPos;
          if (totalItems <= 3) {
            const positions = [
              centerY,
              centerY - amplitude * 0.8,
              centerY + amplitude * 0.8,
            ];
            yPos = positions[index % positions.length];
          } else {
            yPos = centerY + Math.sin((index * Math.PI) / 2) * amplitude * 0.7;
          }

          Matter.Body.setPosition(circle, { x: xPos, y: yPos });
        });
      }

      // Update the viewport
      Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: newWidth, y: newHeight },
      });
    };

    // Debounce the resize handler to prevent too many updates
    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimeout);
      Render.stop(render);
      Runner.stop(runner);
      World.clear(world, true);
      Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
      // Clean up label elements
      if (labelsContainerRef.current) {
        labelsContainerRef.current.remove();
      }
    };
  }, [data]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    />
  );
};
