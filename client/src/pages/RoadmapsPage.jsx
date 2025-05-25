import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import Dsa from "../assets/roadmaps/Dsa.png";
import backend from "../assets/roadmaps/backend.png";
import frontend from "../assets/roadmaps/frontend.png";
import  machine_learning  from "../assets/roadmaps/machine_learning.png";
import competitive_programming from "../assets/roadmaps/competitive_programming.png";
import mobile_development from "../assets/roadmaps/mobile_development.png";
import  Navbar  from "../components/landing/Navbar";
import RoadmapCard from "../components/roadmaps/RoadmapCard";
import RoadmapFilter from "../components/roadmaps/RoadmapFilter";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const staticRoadmaps = [
  {
    id: "1",
    title: "Frontend Development Roadmap",
    description: "Master HTML, CSS, JavaScript, and frameworks like React to build modern web apps.",
    image: frontend,
    author: { name: "Shreyansh" },
    createdAt: "2025-05-01T00:00:00Z",
    category: "beginner",
  },
  {
    id: "2",
    title: "Data Structures & Algorithms",
    description: "Learn arrays, linked lists, trees, and algorithms to ace coding interviews.",
    image: Dsa,
    author: { name: "LeetLabs Team" },
    createdAt: "2025-04-30T00:00:00Z",
    category: "intermediate",
  },
  {
    id: "3",
    title: "Machine Learning Roadmap",
    description: "Dive into Python, NumPy, and TensorFlow to build intelligent systems.",
    image: machine_learning,
    author: { name: "Shreyansh" },
    createdAt: "2025-03-20T00:00:00Z",
    category: "advanced",
  },
  {
    id: "4",
    title: "Backend Development",
    description: "Learn Node.js, Express, and databases to create robust server-side applications.",
    image: backend,
    author: { name: "Shreyansh" },
    createdAt: "2025-05-10T00:00:00Z",
    category: "intermediate",
  },
  {
    id: "5",
    title: "Mobile App Development",
    description: "Build cross-platform apps using Flutter or React Native for iOS and Android.",
    image: mobile_development,
    author: { name: "Hitesh" },
    createdAt: "2025-04-01T00:00:00Z",
    category: "advanced",
  },
  {
    id: "6",
    title: "Competitive Programming",
    description: "Sharpen your problem-solving skills with advanced algorithms and LeetLabs challenges.",
    image: competitive_programming,
    author: { name: "LeetLabs Team" },
    createdAt: "2025-05-15T00:00:00Z",
    category: "advanced",
  },
];

const RoadmapsPage = () => {
  const [filteredRoadmaps, setFilteredRoadmaps] = useState(staticRoadmaps);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let result = staticRoadmaps;
    if (filter !== "all") {
      result = result.filter((roadmap) => roadmap.category === filter);
    }
    if (searchQuery) {
      result = result.filter((roadmap) =>
        roadmap.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredRoadmaps(result);
  }, [filter, searchQuery]);

  return (
    <div className={cn("min-h-screen bg-background text-foreground satoshi")}>
      <Navbar />
      {/* Yellow Header Section */}
      <div className="bg-[#f5b210]/90">
        <div className="max-w-4xl mx-auto px-4 py-12 pt-24 mt-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center items-center gap-3 mb-1">
              <h1 className="text-3xl md:text-4xl font-bold text-black arp-display leading-snug">
                LeetLabs Roadmaps
              </h1>
              <Bot className="w-8 h-8 text-[#f5b210]" />
            </div>
            <p className="text-lg font-medium text-gray-500 max-w-2xl mx-auto">
              Master coding with structured learning paths, from beginner to advanced, curated by experts.
            </p>
          </motion.div>
          <motion.div
            className="max-w-3xl mx-auto mb-8 flex flex-col sm:flex-row gap-4 items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Input
              placeholder="Search roadmaps…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-1/2 h-12 bg-white border-gray-300 text-gray-600 rounded-md shadow-sm focus:ring-[#f5b210] focus:border-[#f5b210] text-base"
            />
            <RoadmapFilter filter={filter} onFilterChange={setFilter} />
          </motion.div>
        </div>
      </div>
      {/* Roadmap Cards Section */}
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {filteredRoadmaps.length === 0 ? (
            <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 arp-display">No Roadmaps Found</h2>
              <p className="text-muted-foreground">
                No roadmaps match your criteria. Try a different filter or search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {filteredRoadmaps.map((roadmap) => (
                <RoadmapCard key={roadmap.id} roadmap={roadmap} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapsPage;