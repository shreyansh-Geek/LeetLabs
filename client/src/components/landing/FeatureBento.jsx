// src/components/landing/FeatureBento.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import cPlusPlus from "../../assets/languages/c++.png";
import goLang from "../../assets/languages/Go-Lang.png";
import java from "../../assets/languages/java.png";
import javascript from "../../assets/languages/javascript.png";
import python from "../../assets/languages/python.png";
import workspace from "../../assets/pages/workspace.jpg";
import {
  ArrowUpRight,
  Zap,
  BarChart3,
  Database,
  Target,
  Code2,
  Library,
  CheckCircle,
  Plus,
  Pencil,
} from "lucide-react";

const languages = [
  { name: "Python", icon: python },
  { name: "C++", icon: cPlusPlus },
  { name: "JavaScript", icon: javascript },
  { name: "Go", icon: goLang },
  { name: "+ More", icon: null }, // No icon for "+ More", we'll render text
];

const features = [
  {
    id: 1,
    title: "Ultimate Coding Workspace",
    description:
      "We offer a rich workspace for solving coding problems with a wide range of tools and features to enhance your coding experience. Whether you’re a beginner or a seasoned pro, our workspace equips you with everything you need to code smarter, faster, and better!",
    icon: <Code2 className="w-6 h-6 text-[#f5b210]" />,
    link: "/problems",
    size: "col-span-2 row-span-2",
    hasCornerIcon: true,
  },
  {
    id: 2,
    title: "Public Sheet Library",
    description:
      "Access a vast, community-driven library of coding Sheets and challenges designed to sharpen your skills and prepare you for real-world problem-solving.",
    icon: <Library className="w-6 h-6 text-[#f5b210]" />,
    link: "/sheets/public",
    size: "col-span-2 row-span-1",
    hasCornerIcon: true,
  },
  {
    id: 3,
    title: "200+",
    description: "Successfully Implemented Coding Problems",
    size: "col-span-1 row-span-1",
    isMetricCard: true,
  },
  {
    id: 4,
    title: "+15%",
    description: "Increase in Performance and Problem-Solving Success Rate",
    size: "col-span-1 row-span-1",
    isMetricCard: true,
  },
  {
    id: 5,
    title: "AI Discussions",
    description:
      "Engage with LeetBot, your AI coding companion to elevate your skills.",
    icon: <Zap className="w-6 h-6 text-[#f5b210]" />,
    size: "col-span-1 row-span-1",
    hasFlowDiagram: true,
    link: "/ai-discussion",
    hasCornerIcon: true,
  },
  {
    id: 7,
    title: "Performance Dashboard",
    description:
      "All important KPIs of your coding journey. Track your coding journey with a sleek dashboard—monitor problem-solving stats, sheets progress, and skill growth in one glance.",
    icon: <BarChart3 className="w-6 h-6 text-[#f5b210]" />,
    link: "/profile",
    size: "col-span-2 row-span-1",
    hasCornerIcon: true,
  },
  {
    id: 6,
    title: "Track Progress",
    description:
      "Effortlessly monitor and track your sheet completion and learning progress. ",
    icon: <CheckCircle className="w-6 h-6 text-[#f5b210]" />,
    size: "col-span-1 row-span-1",
    hasDonutChart: true,
    hasCornerIcon: true,
  },
  {
    id: 8,
    title: "Language Suite",
    description:
      "Explore and practice coding in multiple programming languages, Code in your favorite language —Python, Java, C++, JS, Go, etc.",
    icon: <Code2 className="w-6 h-6 text-[#f5b210]" />,
    size: "col-span-1 row-span-1",
    hasAvatars: true,
    hasCornerIcon: true,
  },
  {
    id: 9,
    title: "Coding Blogs",
    description:
      "Stay ahead with blogs from top coders and experts, offering tips, trends, and best practices to fuel your coding passion.",
    icon: <Database className="w-6 h-6 text-[#f5b210]" />,
    size: "col-span-1 row-span-1",
    hasVennDiagram: true,
    link: "/blogs",
    hasCornerIcon: true,
  },
  {
    id: 10,
    title: "Contribute to the Community",
    description:
      " Contribute by adding coding problems, test cases, or curated sheets to help others learn and improve their skills.",
    icon: <Plus className="w-6 h-6 text-[#f5b210]" />,
    size: "col-span-1 row-span-1",
    link: "/contribute",
    hasCornerIcon: true,
  },
  {
    id: 11,
    title: "Learning Roadmaps",
    description:
      "Follow expert roadmaps to learn and practice coding skills in a structured and engaging way.",
    icon: <Target className="w-6 h-6 text-[#f5b210]" />,
    size: "col-span-1 row-span-1",
    hasGaugeChart: true,
    link: "/roadmaps",
    hasCornerIcon: true,
  },
];

const FeatureBento = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-white">
      {/* Section Heading */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-center mb-6">
          {/* Left Line */}
          <div className="relative w-full max-w-[200px] h-px bg-gradient-to-r from-transparent via-[#f5ac01]/30 to-[#f5ac01]">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#f5ac01] rotate-45 rounded-sm"></div>
          </div>

          {/* Pill */}
          <div className="inline-flex items-center px-2 py-1 mx-2 rounded-full bg-[#f5b210]/10 text-[#f5ac01] text-sm font-bold satoshi">
            Features
          </div>

          {/* Right Line */}
          <div className="relative w-full max-w-[200px] h-px bg-gradient-to-l from-transparent via-[#f5ac01]/30 to-[#f5ac01]">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#f5ac01] rotate-45 rounded-sm"></div>
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 satoshi tracking-tight">
          Engineered for Excellence
        </h2>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[220px] md:auto-rows-[300px]">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            className={cn(
              "relative group overflow-hidden rounded-2xl bg-white border border-gray-500 shadow-lg transition-all duration-300 cursor-pointer",
              feature.size,
              "h-full"
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, shadow: "lg" }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: index * 0.05, ease: "easeOut" }}
          >
            {/* Gradient Overlay on Hover */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br from-[#f5b210]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              )}
            />

            {/* Card Content */}
            <div className="relative h-full p-6 flex flex-col">
              {/* Flow Diagram for AI-Powered Learning */}
              {feature.hasFlowDiagram && (
                <motion.div
                  className="mb-4 bg-[#f5b210]/5 rounded-lg p-4 h-20"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center justify-between h-full">
                    <div className="text-center">
                      <motion.div
                        className="w-8 h-8 bg-[#f5b210] rounded-full mb-1 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </motion.div>
                      <div className="text-xs text-gray-700 satoshi">
                        Ask a Question
                      </div>
                    </div>
                    <motion.div
                      className="flex-1 h-px bg-[#f5b210]/30 mx-2"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    />
                    <div className="text-center">
                      <motion.div
                        className="w-8 h-8 bg-green-500 rounded-full mb-1 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                      >
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </motion.div>
                      <div className="text-xs text-gray-700 satoshi">
                        Get AI Solution
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Donut Chart for Coding Platforms */}
              {feature.hasDonutChart && (
                <motion.div
                  className="mb-4 flex justify-center items-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="30"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <motion.circle
                        cx="40"
                        cy="40"
                        r="30"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${15 * 4.8} ${85 * 4.8}`}
                        className="text-[#f5b210]"
                        initial={{ strokeDashoffset: 15 * 4.8 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-gray-900 satoshi">
                        35%
                      </span>
                      <span className="text-xs text-gray-600 satoshi">
                        Solved
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 text-xs space-y-2">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-[#f5b210] rounded-full mr-2" />
                      <span className="text-gray-700 satoshi">
                        Sheet 1: 53/80
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-2" />
                      <span className="text-gray-700 satoshi">
                        Sheet 2: 0/30
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-2" />
                      <span className="text-gray-700 satoshi">
                        Sheet 3: 0/40
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Avatar Group for Multi-Language Mastery */}
              {feature.hasAvatars && (
                <motion.div
                  className="mb-4 flex -space-x-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {languages.map((language, i) => (
                    <motion.div
                      key={i}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 border-white flex items-center justify-center",
                        language.icon ? "bg-[#f5b210]/50" : "bg-[#f5b210]/10"
                      )}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                      {language.icon ? (
                        <img
                          src={language.icon}
                          alt={`${language.name} icon`}
                          className="w-6 h-6 object-contain"
                          onError={(e) =>
                            (e.target.src =
                              "https://via.placeholder.com/40?text=Icon+Not+Found")
                          }
                        />
                      ) : (
                        <span className="text-2xl font-medium text-[#f5b210] satoshi">
                          +
                        </span>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Venn Diagram for Blogs */}
              {feature.hasVennDiagram && (
                <motion.div
                  className="mb-4 bg-[#f5b210]/5 rounded-lg p-4 h-20 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative w-24">
                    <motion.div
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="w-12 h-12 bg-[#f5b210]/40 rounded-full opacity-70" />
                      <div className="w-12 h-12 bg-orange-400/40 rounded-full opacity-70 -ml-6" />
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-start">
                      <div className="text-xs font-medium text-gray-700 satoshi">
                        Expert Insights
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 text-xs space-y-1">
                    <div className="text-gray-700 satoshi">LeetLabs Blogs</div>
                    <div className="text-gray-700 satoshi">Hashnode Blogs</div>
                  </div>
                </motion.div>
              )}

              {/* Gauge Chart for Learning & Skill Suite */}
              {feature.hasGaugeChart && (
                <motion.div
                  className="mb-4 flex justify-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative w-24 h-12">
                    <svg className="w-24 h-12" viewBox="0 0 96 48">
                      <path
                        d="M 12 42 A 30 30 0 0 1 84 42"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <motion.path
                        d="M 12 42 A 30 30 0 0 1 60 24"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        className="text-[#f5b210]"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                      <div className="text-center">
                        <div className="text-sm font-bold text-gray-900 satoshi">
                          75%
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Metric Cards */}
              {feature.isMetricCard && (
                <div className="flex flex-col justify-center h-full text-center">
                  <motion.div
                    className="text-5xl md:text-6xl font-bold text-gray-900 arp-display mb-3"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.title}
                  </motion.div>
                  <p className="text-sm md:text-base text-gray-700 satoshi leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )}

              {/* Regular Content */}
              {!feature.isMetricCard && (
                <>
                  {/* Icon and Title */}
                  <div className="flex items-start mb-3">
                    {feature.icon && (
                      <motion.div
                        className="mr-3 mt-0.5 flex-shrink-0"
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {feature.icon}
                      </motion.div>
                    )}
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 arp-display leading-tight">
                      {feature.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm md:text-base text-gray-700 satoshi leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Workspace Image for Ultimate Coding Workspace */}
                  {feature.id === 1 && (
                    <motion.div
                      className="mt-0 flex-1 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <img
                        src={workspace}
                        alt="LeetLabs coding workspace preview"
                        className="w-full h-full max-h-80 object-fit rounded-lg shadow-sm"
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/500x300?text=Workspace+Not+Found")
                        }
                      />
                    </motion.div>
                  )}

                  {/* Stacked Sheets Visual for Public Sheet Library */}
                  {feature.id === 2 && (
                    <motion.div
                      className="mt-4 flex-1 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="relative w-80 h-32">
                        {/* Sheet 1 (Bottom) */}
                        <motion.div
                          className="absolute inset-0 bg-gray-100 rounded-lg shadow-md"
                          initial={{ x: -50, rotate: -2 }}
                          animate={{ x: 0, rotate: -2 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <div className="absolute top-4 left-4">
                            <Pencil className="w-5 h-5 text-[#f5b210]" />
                          </div>
                          <div className="absolute bottom-4 right-4 text-xs text-gray-600 satoshi">
                            Sheet #1
                          </div>
                        </motion.div>
                        {/* Sheet 2 (Middle) */}
                        <motion.div
                          className="absolute inset-0 bg-gray-50 rounded-lg shadow-md"
                          initial={{ x: -50, rotate: 0 }}
                          animate={{ x: 10, rotate: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <div className="absolute top-4 left-4">
                            <Code2 className="w-5 h-5 text-[#f5b210]" />
                          </div>
                          <div className="absolute bottom-4 right-4 text-xs text-gray-600 satoshi">
                            Sheet #2
                          </div>
                        </motion.div>
                        {/* Sheet 3 (Top) */}
                        <motion.div
                          className="absolute inset-0 bg-white rounded-lg shadow-md"
                          initial={{ x: -50, rotate: 2 }}
                          animate={{ x: 20, rotate: 2 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <div className="absolute top-4 left-4">
                            <Code2 className="w-5 h-5 text-[#f5b210]" />
                          </div>
                          <div className="absolute bottom-4 right-4 text-xs text-gray-600 satoshi">
                            Sheet #3
                          </div>
                        </motion.div>
                        {/* Community Label */}
                        <motion.div
                          className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-[#f5b210]/10 text-[#f5b210] text-xs font-medium satoshi px-3 py-1 rounded-full"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: -10 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                        >
                          Community-Driven
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              {/* Mini Dashboard Visual for Performance Dashboard */}
              {feature.id === 7 && (
                <motion.div
                  className="mt-4 flex-1 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative w-full max-w-md h-28 bg-[#f5b210]/5 rounded-lg  p-4 flex space-x-4">
                    {/* Problem-Solving Stats (Bar Chart) */}
                    <div className="flex-1">
                      <div className="text-xs text-gray-700 satoshi mb-2">
                        Submissions
                      </div>
                      <div className="flex items-end h-13 space-x-1">
                        <motion.div
                          className="w-4 bg-[#f5b210]/30 rounded-t-sm"
                          initial={{ height: 0 }}
                          animate={{ height: "2rem" }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-4 bg-[#f5b210]/50 rounded-t-sm"
                          initial={{ height: 0 }}
                          animate={{ height: "3rem" }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        />
                        <motion.div
                          className="w-4 bg-[#f5b210]/80 rounded-t-sm"
                          initial={{ height: 0 }}
                          animate={{ height: "2.5rem" }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        />
                        <motion.div
                          className="w-4 bg-[#f5b210] rounded-t-sm"
                          initial={{ height: 0 }}
                          animate={{ height: "3.5rem" }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Sheets Progress (Progress Bar) */}
                    <div className="flex-1 ml-0">
                      <div className="text-xs text-gray-700 satoshi mb-2">
                        Sheets Progress
                      </div>
                      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#f5b210]"
                          initial={{ width: 0 }}
                          animate={{ width: "70%" }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 satoshi mt-1 text-right">
                        70% Complete
                      </div>
                    </div>

                    {/* Skill Growth (Sparkline) */}
                    <div className="flex-1">
                      <div className="text-xs flex justify-end text-gray-700 satoshi mb-2">
                        Skill Growth
                      </div>
                      <svg className="w-full h-12" viewBox="0 0 100 40">
                        <motion.polyline
                          points="0,40 20,35 40,25 60,15 80,20 100,10"
                          fill="none"
                          stroke="#f5b210"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Corner Icon */}
              {feature.hasCornerIcon && (
                <motion.div
                  className="absolute bottom-4 right-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.link ? (
                    <Link
                      to={feature.link}
                      className="w-8 h-8 bg-[#f5b210]/10 rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#f5b210]"
                      aria-label={`Navigate to ${feature.title} page`}
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          scale: { duration: 0.4, ease: "easeOut" },
                          rotate: { duration: 0.4, ease: "easeOut" },
                        }}
                        whileHover={{ scale: 1.2, rotate: 45 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ArrowUpRight className="w-4 h-4 text-[#f5b210]" />
                      </motion.div>
                    </Link>
                  ) : (
                    <div className="w-8 h-8 bg-[#f5b210]/10 rounded-lg flex items-center justify-center">
                      <motion.div
                        className="w-2 h-2 bg-[#f5b210] rounded-full"
                        animate={{
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeatureBento;
