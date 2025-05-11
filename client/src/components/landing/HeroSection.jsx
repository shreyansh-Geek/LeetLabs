import React from "react";
import { Link } from "react-router-dom";
import { InteractiveGridPattern } from "../magicui/interactive-grid-pattern";
import { Highlight } from "../ui/hero-highlight";
import { ShimmerButton } from "../magicui/shimmer-button";
import { motion } from "framer-motion";

// Import language PNGs
import cPlusPlus from "../../assets/languages/c++.png";
import goLang from "../../assets/languages/Go-Lang.png";
import java from "../../assets/languages/java.png";
import javascript from "../../assets/languages/javascript.png";
import php from "../../assets/languages/php.png";
import python from "../../assets/languages/python.png";
import ruby from "../../assets/languages/ruby.png";
import rust from "../../assets/languages/rust.png";
import typescript from "../../assets/languages/typeScript.png";

export default function HeroSection() {
  // Array of language images with their positions, rotations, and sizes
  const languages = [
    { src: cPlusPlus, alt: "C++", style: { top: "15%", left: "10%", width: "80px", transform: "rotate(-15deg)" } },
    { src: goLang, alt: "Go", style: { top: "15%", right: "15%", width: "100px", transform: "rotate(10deg)" } },
    { src: java, alt: "Java", style: { bottom: "37%", left: "15%", width: "130px", transform: "rotate(-10deg)" } },
    { src: typescript, alt: "TypeScript", style: { bottom: "37%", right: "8%", width: "50px", transform: "rotate(-20deg)" } },
    { src: php, alt: "PHP", style: { top: "46%", left: "30%", width: "50px", transform: "rotate(15deg)" } },
    { src: python, alt: "Python", style: { top: "35%", right: "20%", width: "90px", transform: "rotate(-10deg)" } },
    { src: ruby, alt: "Ruby", style: { top: "33%", left: "20%", width: "60px", transform: "rotate(20deg)" } },
    { src: rust, alt: "Rust", style: { top: "10%", right: "40%", width: "65px", transform: "rotate(-5deg)" } },
    { src: javascript, alt: "JavaScript", style: { top: "14%", left: "38%", width: "70px", transform: "rotate(8deg)" } },
  ];

  return (
    <section className="relative h-screen w-full bg-white text-black flex items-center justify-center overflow-hidden">
      {/* SVG wrapper to apply the radial gradient mask */}
      <svg className="absolute inset-0 h-full w-full z-0">
        {/* Define the radial gradient for the mask */}
        <defs>
          <radialGradient id="radialFadeGradient" cx="50%" cy="50%" r="58%">
            <stop offset="0%" style={{ stopColor: "white", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "white", stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: "white", stopOpacity: 0 }} />
          </radialGradient>
          <mask id="radialFadeMask">
            <rect x="0" y="0" width="100%" height="100%" fill="url(#radialFadeGradient)" />
          </mask>
        </defs>

        {/* Apply the mask to the InteractiveGridPattern */}
        <g mask="url(#radialFadeMask)">
          <InteractiveGridPattern
            width={65}
            height={65}
            squares={[50, 50]}
            strokeColor="gray-600/50"
            fillColor="gray-400/70"
            className="h-full w-full opacity-60 shadow-md"
            squaresClassName="shadow-[0_0_10px_rgba(0,0,0,0.3)]"
          />
        </g>
      </svg>

      {/* Language PNGs scattered in the background */}
      {languages.map((language, index) => {
        // Extract the rotation angle from the transform string (e.g., "rotate(-15deg)")
        const rotateMatch = language.style.transform.match(/rotate\(([-]?\d+)deg\)/);
        const rotateAngle = rotateMatch ? parseFloat(rotateMatch[1]) : 0;

        // Remove the transform from the style to avoid conflicts with Framer Motion
        const { transform, ...restStyle } = language.style;

        return (
          <motion.img
            key={index}
            src={language.src}
            alt={language.alt}
            className="absolute z-[5] opacity-80"
            style={{
              ...restStyle, // Apply all styles except transform
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
            }}
            initial={{
              top: "50%", // Start at the center
              left: "50%", // Start at the center
              opacity: 0,
              rotate: rotateAngle,
            }}
            animate={{
              top: restStyle.top || "auto", // Animate to final top position
              left: restStyle.left || "auto", // Animate to final left position
              right: restStyle.right || "auto", // Animate to final right position
              bottom: restStyle.bottom || "auto", // Animate to final bottom position
              y: [0, -5, 0], // Original floating effect
              opacity: 0.8,
              rotate: rotateAngle,
              transition: {
                top: { duration: 1, ease: "easeOut", delay: index * 0.1 }, // Staggered scattering
                left: { duration: 1, ease: "easeOut", delay: index * 0.1 },
                right: { duration: 1, ease: "easeOut", delay: index * 0.1 },
                bottom: { duration: 1, ease: "easeOut", delay: index * 0.1 },
                opacity: { duration: 1, delay: index * 0.1 },
                y: {
                  repeat: Infinity,
                  duration: 3 + index * 0.3,
                  ease: "easeInOut",
                  delay: 1, // Start floating after scattering
                },
              },
            }}
          />
        );
      })}

      {/* Content Overlay */}
      <div className="text-center">
        <h1 className="z-10 text-3xl md:text-5xl font-bold mt-0 mb-4 text-black arp-display leading-snug text-center max-w-4xl mx-auto">
          A Lab where Coders{" "}
          <Highlight
            fromColor="yellow-300"
            toColor="yellow-500"
            shape="rounded-none"
            tilt={-2}
            textColor="white"
          >
            Practice
          </Highlight>{" "}
          and{" "}
          <Highlight
            fromColor="indigo-300"
            toColor="indigo-500"
            shape="rounded-none"
            tilt={-2}
            textColor="white"
          >
            Prove
          </Highlight>{" "}
          Themselves
        </h1>
        <p className="z-10 text-lg md:text-lg text-gray-600 max-w-3xl mb-8 mx-auto">
          Train rigorously, solve real challenges, and sharpen your coding mind.{" "}
          <br />
          LeetLabs is your lab to practice and push past your limits — built for coders who want to lead.
        </p>
        <div className="flex justify-center gap-5 max-w-3xl mb-8 mx-auto">
          <Link to="/signup">
            <ShimmerButton
              shimmerColor="#f5b210"
              borderRadius="7px"
              shimmerSize="0.15em"
              background="black"
              className="px-8 py-3 text-lg font-semibold group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]"
            >
              Join For Free
            </ShimmerButton>
          </Link>
          <Link
            to="/login"
            className="z-10 transition-all duration-300 ease-in-out text-gray-600 border hover:border-yellow-600 border-gray-600 hover:shadow-[0_2px_2px_#f5b210] px-6 py-3 rounded-md text-lg font-semibold bg-white"
          >
            Explore Sheets
          </Link>
        </div>
      </div>
    </section>
  );
}