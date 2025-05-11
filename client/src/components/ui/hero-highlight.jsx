"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

// Tailwind color name to hex mapping
const tailwindColors = {
  "yellow-300": "#fec60b",
  "yellow-500": "#ec9913",
  "indigo-300": "#8088fb",
  "purple-300": "#d8b4fe",
  "indigo-500": "#406eea",
  "purple-500": "#a855f7",
  "white": "#ffffff",
  "black": "#000000",
};

// Highlight component with tilt effect and text color transition
export const Highlight = ({
  children,
  className,
  fromColor = "indigo-300", // Default start color
  toColor = "purple-300", // Default end color
  shape = "rounded-lg", // Default shape (border radius)
  tilt = 0, // Default tilt angle (in degrees)
  textColor = "white", // Default final text color
}) => {
  // Map Tailwind color names to hex values, or use the color directly if it's a hex
  const fromHex = fromColor.startsWith("#")
    ? fromColor
    : tailwindColors[fromColor] || "#a5b4fc"; // Fallback to indigo-300 hex
  const toHex = toColor.startsWith("#")
    ? toColor
    : tailwindColors[toColor] || "#d8b4fe"; // Fallback to purple-300 hex

  return (
    <motion.span
      initial={{
        backgroundSize: "0% 100%",
        rotate: tilt, // Apply tilt immediately
        color: "black", // Start with black text
      }}
      animate={{
        backgroundSize: "100% 100%",
        rotate: tilt, // Ensure tilt persists during animation
        color: textColor, // Transition to the specified text color (default: white)
      }}
      transition={{
        duration: 2,
        ease: "linear",
        delay: 0.5,
      }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        display: "inline-block", // Ensure transforms work correctly
        backgroundImage: `linear-gradient(to right, ${fromHex}, ${toHex})`,
      }}
      className={cn(`relative inline-block px-2 py-1`, shape, className)}
    >
      {children}
    </motion.span>
  );
};