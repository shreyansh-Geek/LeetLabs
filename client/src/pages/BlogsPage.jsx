import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import  Navbar  from "../components/landing/Navbar";
import BlogCard from "../components/Blogs/BlogCard";
import BlogFilter from "../components/Blogs/BlogFilter";
import { apiFetch, cn } from "../lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const response = await apiFetch("/blogs");
        setBlogs(response.blogs);
        setFilteredBlogs(response.blogs);
      } catch (err) {
        setError("Failed to load blogs. Please try again.");
        toast.error("Error fetching blogs");
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, []);

  // Handle filter and search
  useEffect(() => {
    let result = blogs;
    if (filter !== "all") {
      result = result.filter((blog) => blog.type === filter);
    }
    if (searchQuery) {
      result = result.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredBlogs(result);
  }, [filter, searchQuery, blogs]);

  return (
    <div className={cn("min-h-screen bg-background text-foreground satoshi")}>
      <Navbar />
      {/* Yellow Header Section */}
      <div className="bg-[#f5b210]/90">
        <div className="max-w-4xl mx-auto px-4 py-12 pt-24 mt-10">
          {/* Title and Description */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center items-center gap-3 mb-1">
              <h1 className="text-3xl md:text-4xl font-bold text-black arp-display leading-snug">
                LeetLabs Blog
              </h1>
            </div>
            <p className="text-lg font-medium text-gray-500 max-w-2xl mx-auto">
              Explore insights, tutorials, and tech trends from our platform and the official Hashnode publication community.
            </p>
          </motion.div>
          {/* Search and Filter */}
          <motion.div
            className="max-w-3xl mx-auto mb-8 flex flex-col sm:flex-row gap-4 items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Input
              placeholder="Search blog posts…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-1/2 h-12 bg-white border-gray-300 text-gray-600 rounded-md shadow-sm focus:ring-[#f5b210] focus:border-[#f5b210] text-base"
            />
            <BlogFilter filter={filter} onFilterChange={setFilter} />
          </motion.div>
        </div>
      </div>
      {/* Blog Cards Section */}
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-lg">Loading blogs...</p>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 arp-display">Error</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 arp-display">No Blogs Found</h2>
              <p className="text-muted-foreground">
                No blogs match your criteria. Try a different filter or search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;