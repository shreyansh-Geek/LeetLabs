// client/src/pages/CoursesPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Rocket, ExternalLink, Star, Copy } from "lucide-react";
import { ShimmerButton } from "../components/magicui/shimmer-button";
import { ScratchToReveal } from "../components/magicui/scratch-to-reveal";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

const courses = [
  {
    title: "Interview Preparation with JavaScript",
    description:
      "Master JavaScript for coding interviews with expert-led lessons, hands-on coding challenges, and real-world problem-solving techniques to ace technical interviews.",
    rating: 4.8,
    media: {
      type: "image",
      src: "https://imgproxy.learnyst.com/learnyst-user-assets/school-assets/schools/171024/courses/198599/1720795627193batch2_lyst1720795627201.png",
    },
    link: "https://courses.chaicode.com/learn/fast-checkout/198599?priceId=0&code=SHREYANS52573&is_affiliate=true&tc=SHREYANS52573",
  },
  {
    title: "Web Development Cohort",
    description:
      "Build modern, responsive web applications with this comprehensive full-stack development program, covering front-end, back-end, and deployment best practices.",
    rating: 4.8,
    media: {
      type: "youtube",
      src: "https://www.youtube.com/embed/yG8JMlldoCE?si=WmrGJEeJ6gW1tRir",
    },
    link: "https://courses.chaicode.com/learn/fast-checkout/214297?priceId=0&code=SHREYANS52573&is_affiliate=true&tc=SHREYANS52573",
  },
  {
    title: "Full Stack Data Science",
    description:
      "Master end-to-end data science, from data collection and analysis to building and deploying machine learning models, with hands-on projects and expert guidance.",
    rating: 4.9,
    media: {
      type: "youtube",
      src: "https://www.youtube.com/embed/Kjd-SWpe1do?si=d5sGa4_19jSlaIw6",
    },
    link: "https://courses.chaicode.com/learn/fast-checkout/227817?priceId=0&code=SHREYANS52573&is_affiliate=true&tc=SHREYANS52573",
  },
  {
    title: "DevOps for Developers",
    description:
      "Streamline development and deployment workflows by mastering DevOps practices, including CI/CD pipelines, containerization, and cloud infrastructure management.",
    rating: 4.7,
    media: {
      type: "youtube",
      src: "https://www.youtube.com/embed/oBLpqSHc3lA?si=5biCPfN5tvgzFl-9",
    },
    link: "https://courses.chaicode.com/learn/fast-checkout/227963?priceId=0&code=SHREYANS52573&is_affiliate=true&tc=SHREYANS52573",
  },
  {
    title: "GenAI with Python 2.0",
    description:
      "Dive into generative AI with Python, learning to build intelligent applications, from natural language processing to creative AI models, with practical projects.",
    rating: 4.6,
    media: {
      type: "youtube",
      src: "https://www.youtube.com/embed/6RHYkwJPJlM?si=GUAxZTWsWcEEVAa-",
    },
    link: "https://courses.chaicode.com/learn/fast-checkout/232480?priceId=0&code=SHREYANS52573&is_affiliate=true&tc=SHREYANS52573",
  },
];

export default function CoursesPage() {
  const [revealed, setRevealed] = useState({});
  const [showDiscountCard, setShowDiscountCard] = useState({});
  const [copied, setCopied] = useState({});
  const cardRefs = useRef({});

  const handleScratchComplete = (index) => {
    setRevealed((prev) => ({ ...prev, [index]: true }));
  };

  const toggleDiscountCard = (index) => {
    setShowDiscountCard((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleCopyCode = async (index) => {
    try {
      await navigator.clipboard.writeText("SHREYANS52573");
      setCopied((prev) => ({ ...prev, [index]: true }));
      setTimeout(
        () => setCopied((prev) => ({ ...prev, [index]: false })),
        2000
      );
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(showDiscountCard).forEach((index) => {
        if (
          showDiscountCard[index] &&
          cardRefs.current[index] &&
          !cardRefs.current[index].contains(event.target)
        ) {
          setShowDiscountCard((prev) => ({ ...prev, [index]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDiscountCard]);

  return (
    <div className="min-h-screen bg-white flex flex-col satoshi">
      <Navbar />
      {/* Beta Strip */}
      <div className="relative w-full bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-center shadow-sm mt-18.5">
        <div className="absolute inset-0 bg-amber-400/10 animate-pulse" />
        <div className="relative z-10 flex items-center justify-center gap-3 px-4">
          <Rocket className="size-5 text-gray-900" />
          <p className="text-base font-medium text-gray-900">
            LeetLabs is in <span className="font-bold">Beta</span>! Use code{" "}
            <span className="font-bold underline">SHREYANS52573</span> for
            additional 10% off on these courses!
          </p>
        </div>
      </div>
      {/* Courses Section */}
      <section className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 text-center arp-display">
            Discover Our Featured Courses
          </h1>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-12 text-center">
            Unlock your potential with expertly crafted courses by{" "}
            <a
              href="https://www.chaicode.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f6a21a] font-bold hover:underline"
            >
              ChaiCode
            </a>{" "}
            and now featured at LeetLabs. Start your learning journey today.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative w-full h-48 sm:h-56 bg-gray-100">
                  {course.media.type === "image" ? (
                    <img
                      src={course.media.src}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <iframe
                      src={`${course.media.src}&controls=1&rel=0&modestbranding=1`}
                      title={course.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {course.title}
                    </h2>
                    <div className="flex items-center bg-amber-100 text-amber-800 text-sm font-medium px-2.5 py-1 rounded-full">
                      <Star className="size-4 mr-1 fill-amber-400" />
                      {course.rating}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center gap-4">
                    <ShimmerButton
                      shimmerColor="#f5b210"
                      borderRadius="60px"
                      shimmerSize="0.15em"
                      background="black"
                      className="px-4 py-1.5 text-sm font-semibold group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]"
                      onClick={() => window.location.assign(course.link)}
                    >
                      Enroll Now <ExternalLink className="size-4 inline ml-1" />
                    </ShimmerButton>
                    <button
                      className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors cursor-pointer"
                      onClick={() => toggleDiscountCard(index)}
                    >
                      Reveal Discount
                    </button>
                  </div>
                </div>
                <AnimatePresence>
                  {showDiscountCard[index] && (
                    <motion.div
                      ref={(el) => (cardRefs.current[index] = el)}
                      className="absolute bottom-16 right-6 w-48 h-32 bg-white rounded-lg shadow-xl border border-amber-100 flex items-center justify-center overflow-hidden"
                      initial={{ scale: 0, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0, opacity: 0, y: 20 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <ScratchToReveal
                        width={192}
                        height={128}
                        minScratchPercentage={70}
                        className="flex items-center justify-center rounded-lg"
                        gradientColors={["#f5b210", "#ec9913", "#ffffff"]}
                        onComplete={() => handleScratchComplete(index)}
                      >
                        <div className="flex flex-col items-center justify-center gap-3 p-2">
                          <p className="text-sm font-semibold text-gray-900">
                            {revealed[index]
                              ? "SHREYANS52573"
                              : "Scratch to Reveal"}
                          </p>
                          {revealed[index] && (
                            <motion.button
                              className="flex items-center gap-1 text-xs font-medium text-white bg-amber-400 hover:bg-amber-500 px-4 py-1.5 rounded-full transition-colors"
                              onClick={() => handleCopyCode(index)}
                              whileTap={{ scale: 0.95 }}
                              animate={{
                                scale: copied[index] ? [1, 1.1, 1] : 1,
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <Copy className="size-3" />
                              {copied[index] ? "Copied!" : "Copy Code"}
                            </motion.button>
                          )}
                        </div>
                      </ScratchToReveal>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
