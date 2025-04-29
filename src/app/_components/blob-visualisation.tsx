"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";
import { getSubmitter } from "./blob-info";
import { useBlobStore } from "./blob.provider";
import { BlobData, getBlobs } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useMobileDesktop } from "@/hooks/use-is-mobile";

export const BlobVisualisation = () => {
  const { selectedDate, hoveredSubmitters } = useBlobStore();
  const previousDataRef = useRef<BlobData[] | null>(null);

  const { sizes } = useMobileDesktop(
    { sizes: { min: 20, max: 100 } },
    { sizes: { min: 25, max: 200 } }
  );

  const { data } = useQuery({
    queryKey: ["blobs", selectedDate],
    queryFn: () => getBlobs(selectedDate),
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const labelsContainerRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<Matter.World | null>(null);
  const circlesRef = useRef<{ [key: string]: Matter.Body }>({});
  const labelElementsRef = useRef<{ [key: string]: HTMLDivElement }>({});
  const nameElementsRef = useRef<{ [key: string]: HTMLDivElement }>({});
  const initialized = useRef(false);

  // Set up Matter.js engine and renderer once on initial mount
  useEffect(() => {
    if (!containerRef.current || initialized.current) return;
    initialized.current = true;

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
    worldRef.current = world;

    // Get dimensions from container
    const width = window.innerWidth;
    const height = window.innerHeight;

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

    // Create renderer
    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: width,
        height: height,
        showAngleIndicator: false,
        wireframes: false,
        background: "transparent",
      },
    });
    renderRef.current = render;

    Render.run(render);

    // Create runner
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

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

    // Add walls
    const walls = createWalls(width, height);
    World.add(world, walls);

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
      circleBodies.forEach((body) => {
        const submitter = body.label;
        // Use Matter.js to check if point is inside circle
        const isInside = Matter.Query.point([body], mousePosition).length > 0;

        // Show/hide the name based on whether mouse is inside circle
        if (nameElementsRef.current[submitter]) {
          if (isInside) {
            nameElementsRef.current[submitter].style.display = "block";
            hoveredSubmitters.add(submitter);
          } else if (hoveredSubmitters.has(submitter)) {
            nameElementsRef.current[submitter].style.display = "none";
            hoveredSubmitters.delete(submitter);
          }
        }
      });
    });

    // Also handle mouseleave on canvas to reset all hovers
    render.canvas.addEventListener("mouseleave", () => {
      hoveredSubmitters.forEach((submitter) => {
        if (nameElementsRef.current[submitter as string]) {
          nameElementsRef.current[submitter as string].style.display = "none";
        }
      });
      hoveredSubmitters.clear();
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
      bodies.forEach((body) => {
        const submitter = body.label;
        if (labelElementsRef.current[submitter]) {
          labelElementsRef.current[submitter].style.left =
            `${body.position.x}px`;
          labelElementsRef.current[submitter].style.top =
            `${body.position.y}px`;
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

      // Reposition circles
      updateBlobPositions(newWidth, newHeight);

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

      // Reset all refs
      initialized.current = false;
      engineRef.current = null;
      renderRef.current = null;
      runnerRef.current = null;
      worldRef.current = null;
      circlesRef.current = {};
      labelElementsRef.current = {};
      nameElementsRef.current = {};
      labelsContainerRef.current = null;
    };
  }, []);

  // Function to calculate positions for blobs
  const calculatePositions = (
    totalItems: number,
    width: number,
    height: number
  ) => {
    const positions: { x: number; y: number }[] = [];
    const horizontalPadding = width * 0.1;
    const verticalPadding = height * 0.15;
    const availableWidth = width - horizontalPadding * 2;
    const availableHeight = height - verticalPadding * 2;
    const centerY = height / 2;
    const amplitude = availableHeight / 3;

    for (let i = 0; i < totalItems; i++) {
      let xPos = horizontalPadding + (availableWidth * i) / (totalItems - 1);
      if (totalItems === 1) xPos = width / 2;

      let yPos;
      if (totalItems <= 3) {
        const positions = [
          centerY,
          centerY - amplitude * 0.8,
          centerY + amplitude * 0.8,
        ];
        yPos = positions[i % positions.length];
      } else {
        yPos = centerY + Math.sin((i * Math.PI) / 2) * amplitude * 0.7;
      }

      positions.push({ x: xPos, y: yPos });
    }

    return positions;
  };

  // Function to update blob positions (used during resize)
  const updateBlobPositions = (width: number, height: number) => {
    if (!worldRef.current) return;

    const world = worldRef.current;
    const circleBodies = Matter.Composite.allBodies(world).filter(
      (body) =>
        body.label !== "topWall" &&
        body.label !== "bottomWall" &&
        body.label !== "leftWall" &&
        body.label !== "rightWall"
    );

    if (circleBodies.length === 0) return;

    const positions = calculatePositions(circleBodies.length, width, height);

    circleBodies.forEach((circle, index) => {
      Matter.Body.setPosition(circle, positions[index]);
    });
  };

  // Update blobs when data changes
  useEffect(() => {
    if (
      !data ||
      !worldRef.current ||
      !engineRef.current ||
      !labelsContainerRef.current
    )
      return;

    const world = worldRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const Bodies = Matter.Bodies;
    const World = Matter.World;

    // Find max blob value for sizing
    const maxBlobValue = Math.max(...data.map((item) => item.blobs));
    const minSize = sizes.min;
    const maxSize = sizes.max;

    // Calculate positions based on total number of items - only for new blobs
    const existingSubmitters = new Set(Object.keys(circlesRef.current));
    const newSubmitters = data
      .map((item) => item.blob_submitter)
      .filter((submitter) => !existingSubmitters.has(submitter));

    // Calculate positions only for new blobs, to avoid repositioning existing ones
    const newBlobPositions = calculatePositions(
      newSubmitters.length,
      width,
      height
    );

    // Track which submitters are in the new data
    const currentSubmitters = new Set(data.map((item) => item.blob_submitter));

    // For blobs that are no longer in the data, shrink them to a minimal size instead of removing them
    const submittersToShrink = Object.keys(circlesRef.current).filter(
      (submitter) => !currentSubmitters.has(submitter)
    );

    submittersToShrink.forEach((submitter) => {
      if (circlesRef.current[submitter]) {
        const circle = circlesRef.current[submitter];
        const currentRadius = circle.circleRadius || minSize;

        // Animate shrinking to nearly invisible size
        const animate = () => {
          const targetRadius = 1; // Very small but still exists
          const radiusDifference = targetRadius - currentRadius;
          const totalSteps = 15;
          let currentStep = 0;

          const animation = setInterval(() => {
            if (currentStep >= totalSteps) {
              clearInterval(animation);

              // Hide the label element after animation completes
              if (labelElementsRef.current[submitter]) {
                labelElementsRef.current[submitter].style.visibility = "hidden";
              }
              return;
            }

            // Calculate new size
            const newRadius =
              currentRadius +
              (radiusDifference * (currentStep + 1)) / totalSteps;

            // Avoid scaling to zero which can cause issues
            const scaleFactor = Math.max(
              newRadius / (circle.circleRadius || 1),
              0.01
            );

            // Apply changes
            Matter.Body.scale(circle, scaleFactor, scaleFactor);

            currentStep++;
          }, 16);
        };

        animate();

        // Hide name element immediately
        if (nameElementsRef.current[submitter]) {
          nameElementsRef.current[submitter].style.display = "none";
        }
      }
    });

    // Update or add blobs
    data.forEach((item) => {
      const submitter = item.blob_submitter;
      const blobRatio = item.blobs / maxBlobValue;
      const targetRadius = minSize + blobRatio * (maxSize - minSize);

      // Configure circle options with color
      const getCircleOptions = () => {
        const { color } = getSubmitter(submitter);
        return {
          friction: 0.05,
          frictionStatic: 0.1,
          restitution: 0,
          render: {
            fillStyle: color,
            lineWidth: 0,
          },
        } satisfies Matter.IBodyDefinition;
      };

      if (circlesRef.current[submitter]) {
        // Update existing blob - keep position, only change size
        const circle = circlesRef.current[submitter];
        const currentRadius = circle.circleRadius || minSize;

        // Make sure the label is visible in case it was previously hidden
        if (labelElementsRef.current[submitter]) {
          labelElementsRef.current[submitter].style.visibility = "visible";
        }

        // Animate only size changes
        const animate = () => {
          const radiusDifference = targetRadius - currentRadius;
          const totalSteps = 20;
          let currentStep = 0;

          const animation = setInterval(() => {
            if (currentStep >= totalSteps) {
              clearInterval(animation);
              return;
            }

            // Calculate new size
            const newRadius =
              currentRadius +
              (radiusDifference * (currentStep + 1)) / totalSteps;
            const scaleFactor = newRadius / (circle.circleRadius || 1);

            // Apply changes
            Matter.Body.scale(circle, scaleFactor, scaleFactor);

            currentStep++;
          }, 16); // ~60fps for smoother animation
        };

        animate();
      } else {
        // Find a position for the new blob
        const newBlobIndex = newSubmitters.indexOf(submitter);
        const position =
          newBlobIndex !== -1
            ? newBlobPositions[newBlobIndex]
            : { x: width / 2, y: height / 2 }; // Fallback position if something went wrong

        // Create a new blob
        const circle = Bodies.circle(
          position.x,
          position.y,
          targetRadius,
          getCircleOptions()
        );

        // Add a label with the submitter name
        circle.label = submitter;
        circlesRef.current[submitter] = circle;

        // Add to world
        World.add(world, circle);

        // Create label elements
        const { icon } = getSubmitter(submitter);

        // Create label container
        const label = document.createElement("div");
        label.style.position = "absolute";
        label.style.textAlign = "center";
        label.style.transform = "translate(-50%, -50%)";
        label.style.pointerEvents = "none";
        label.style.left = `${position.x}px`;
        label.style.top = `${position.y}px`;
        label.style.visibility = "visible";

        // Create submitter name element (hidden by default)
        const nameElement = document.createElement("div");
        nameElement.textContent = submitter;
        nameElement.style.position = "absolute";
        nameElement.style.bottom = "130%";
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
        nameElement.style.display = "none";
        nameElement.style.zIndex = "100";
        nameElementsRef.current[submitter] = nameElement;

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
          // If no icon, use circle color as indicator
          const placeholder = document.createElement("div");
          placeholder.style.width = "20px";
          placeholder.style.height = "20px";
          placeholder.style.borderRadius = "50%";
          placeholder.style.backgroundColor = getSubmitter(submitter).color;
          placeholder.style.border = "2px solid white";
          placeholder.style.boxShadow = "0px 0px 4px rgba(0,0,0,0.3)";

          label.appendChild(placeholder);
          label.appendChild(nameElement);
        }

        // Add null check before accessing labelsContainerRef.current
        if (labelsContainerRef.current) {
          labelsContainerRef.current.appendChild(label);
          labelElementsRef.current[submitter] = label;
        }
      }
    });

    // Store the current data for future comparison
    previousDataRef.current = data;
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
