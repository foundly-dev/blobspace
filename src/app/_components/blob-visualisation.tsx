"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";
import { getSubmitter } from "./blob-info";
import { useBlobStore } from "./blob.provider";
import { getBlobs } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const BlobVisualisation = () => {
  const { selectedDate } = useBlobStore();

  const { data } = useQuery({
    queryKey: ["blobs", selectedDate],
    queryFn: () => getBlobs(selectedDate),
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine>(null);
  const renderRef = useRef<Matter.Render>(null);
  const runnerRef = useRef<Matter.Runner>(null);
  const labelsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data) return;
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
    const nameElements: HTMLDivElement[] = []; // Store references to name elements

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

        const { icon } = getSubmitter(item.blob_submitter);
        // Create label container
        const label = document.createElement("div");
        label.style.position = "absolute";
        label.style.textAlign = "center";
        label.style.transform = "translate(-50%, -50%)";
        label.style.pointerEvents = "none"; // Disable pointer events on label

        // Create submitter name element (hidden by default)
        const nameElement = document.createElement("div");
        nameElement.textContent = item.blob_submitter;
        nameElement.style.position = "absolute";
        nameElement.style.bottom = "130%"; // Position above the icon
        nameElement.style.left = "50%";
        nameElement.style.transform = "translateX(-50%)";
        nameElement.style.color = "#fff";
        nameElement.style.fontSize = "14px";
        nameElement.style.fontWeight = "bold";
        nameElement.style.textShadow = "1px 1px 2px rgba(0,0,0,0.7)";
        nameElement.style.backgroundColor = "rgba(0,0,0,0.5)";
        nameElement.style.padding = "3px 6px";
        nameElement.style.borderRadius = "4px";
        nameElement.style.whiteSpace = "nowrap";
        nameElement.style.display = "none"; // Hidden by default
        nameElement.style.zIndex = "100";
        nameElements.push(nameElement); // Store reference to name element

        if (icon) {
          // Create and add icon
          const img = document.createElement("img");
          img.src = icon;
          img.style.width = "28px";
          img.style.height = "28px";
          img.style.borderRadius = "50%";
          img.style.border = "2px solid white";
          img.style.backgroundColor = "white";
          img.style.boxShadow = "0px 0px 4px rgba(0,0,0,0.3)";
          label.appendChild(img);
          label.appendChild(nameElement);
        } else {
          // If no icon, use circle color as indicator but keep name hidden initially
          const placeholder = document.createElement("div");
          placeholder.style.width = "20px";
          placeholder.style.height = "20px";
          placeholder.style.borderRadius = "50%";
          placeholder.style.backgroundColor = getSubmitter(
            item.blob_submitter
          ).color;
          placeholder.style.border = "2px solid white";
          placeholder.style.boxShadow = "0px 0px 4px rgba(0,0,0,0.3)";

          label.appendChild(placeholder);
          label.appendChild(nameElement);
        }

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

    // Track which circles are being hovered
    const hoveredCircles = new Set();

    // Add mousemove listener to the canvas to detect hovering over circles
    render.canvas.addEventListener("mousemove", (event) => {
      const mousePosition = {
        x: event.clientX,
        y: event.clientY,
      };

      // Get all non-wall bodies
      const circleBodies = Composite.allBodies(world).filter(
        (body) =>
          body.label !== "topWall" &&
          body.label !== "bottomWall" &&
          body.label !== "leftWall" &&
          body.label !== "rightWall"
      );

      // Check if mouse is inside any circle
      circleBodies.forEach((body, index) => {
        // Use Matter.js to check if point is inside circle
        const isInside = Matter.Query.point([body], mousePosition).length > 0;

        // Show/hide the name based on whether mouse is inside circle
        if (index < nameElements.length) {
          if (isInside) {
            nameElements[index].style.display = "block";
            hoveredCircles.add(index);
          } else if (hoveredCircles.has(index)) {
            nameElements[index].style.display = "none";
            hoveredCircles.delete(index);
          }
        }
      });
    });

    // Also handle mouseleave on canvas to reset all hovers
    render.canvas.addEventListener("mouseleave", () => {
      hoveredCircles.forEach((index) => {
        const _index = index as number;
        if (_index < nameElements.length) {
          nameElements[_index].style.display = "none";
        }
      });
      hoveredCircles.clear();
    });

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
