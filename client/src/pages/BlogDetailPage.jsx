import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import  Navbar  from "../components/landing/Navbar";
import { apiFetch, cn } from "../lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await apiFetch(`/blogs/${id}`);
        setBlog(response.blog);
      } catch (err) {
        setError("Failed to load blog. Please try again.");
        toast.error("Error fetching blog");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className={cn("min-h-screen bg-background text-foreground satoshi")}>
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-lg">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className={cn("min-h-screen bg-background text-foreground satoshi")}>
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 arp-display">
              {error ? "Error" : "Blog Not Found"}
            </h2>
            <p className="text-muted-foreground">
              {error || "The blog you’re looking for doesn’t exist."}
            </p>
            <Button asChild className="mt-4">
              <Link to="/blogs">Back to Blogs</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background text-foreground satoshi")}>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          {blog.coverImage && (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          <h1 className="text-3xl md:text-4xl font-bold arp-display mb-4">
            {blog.title}
          </h1>
          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <span>By {blog.author.name}</span>
            <span className="mx-2">•</span>
            <span>{format(new Date(blog.createdAt), "PPP")}</span>
          </div>
          <div className="w-full h-1 bg-gray-600 mb-8"></div>
          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.content}
            </ReactMarkdown>
          </div>
          {/* Back Button */}
          <Button asChild variant="outline" className="mt-8">
            <Link to="/blogs">Back to Blogs</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetailPage;