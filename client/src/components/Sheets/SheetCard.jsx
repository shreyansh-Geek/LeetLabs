import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Clock,
  Hash,
  ArrowRight,
  Share2,
  Twitter,
  Linkedin,
  Copy,
  Trash2,
  Plus,
  Edit2,
} from "lucide-react";
import { TbArrowBigUpFilled } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const SheetCard = ({
  sheet,
  index,
  isFeatured,
  openTagsModal,
  handleCloneSheet,
  handleDeleteSheet,
  handleEditSheet,
  user,
  showProgress = false,
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(
    sheet.upvotes || Math.floor(Math.random() * 101)
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: sheet.name,
    description: sheet.description || "",
    tags: sheet.tags ? sheet.tags.join(", ") : "",
    visibility: sheet.visibility,
  });

  // Format date to DD/Month/YYYY
  const formatDate = (date) => {
    if (!date) {
      console.warn("formatDate: No date provided, falling back to createdAt", {
        sheetId: sheet.id,
        date,
      });
      return sheet.createdAt ? formatDate(sheet.createdAt) : "Unknown";
    }
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        console.warn("formatDate: Invalid date, falling back to createdAt", {
          sheetId: sheet.id,
          date,
        });
        return sheet.createdAt ? formatDate(sheet.createdAt) : "Unknown";
      }
      const day = String(d.getDate()).padStart(2, "0");
      const month = d.toLocaleString("en-US", { month: "short" });
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("formatDate: Error parsing date", {
        sheetId: sheet.id,
        date,
        error: error.message,
      });
      return sheet.createdAt ? formatDate(sheet.createdAt) : "Unknown";
    }
  };

  // Share functionality
  const handleShare = (platform) => {
    const shareUrl = `${window.location.origin}/sheet/${sheet.id}`;
    const title = sheet.name;
    let url;
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareUrl
        )}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      default:
        return;
    }
    window.open(url, "_blank");
    setIsShareOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/sheet/${sheet.id}`
    );
    toast.success("Link copied to clipboard!");
    setIsShareOpen(false);
  };

  const handleUpvote = () => {
    if (isUpvoted) {
      setUpvoteCount(upvoteCount - 1);
    } else {
      setUpvoteCount(upvoteCount + 1);
    }
    setIsUpvoted(!isUpvoted);
    console.log(`Upvoted sheet ${sheet.id}: ${upvoteCount}`);
  };

  // Handle input changes in the edit modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for editing the sheet
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedSheet = {
      name: editForm.name.trim(),
      description: editForm.description.trim() || null,
      tags: editForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      visibility: editForm.visibility,
    };

    // Validate inputs
    if (!updatedSheet.name) {
      toast.error("Sheet name is required");
      return;
    }

    if (updatedSheet.tags.length === 0) {
      toast.error("At least one tag is required");
      return;
    }

    // If the sheet is cloned, prevent making it public
    if (sheet.isCloned && updatedSheet.visibility === "PUBLIC") {
      toast.error("Cloned sheets cannot be made public");
      return;
    }

    try {
      await handleEditSheet(sheet.id, updatedSheet);
      toast.success("Sheet updated successfully");
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to update sheet");
    }
  };

  // Log creator data for debugging
  if (!showProgress && !sheet.isAdminCreated && !sheet.creator?.name) {
    console.warn("Missing creator name for public sheet", {
      sheetId: sheet.id,
      creator: sheet.creator,
    });
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className={cn(
          "relative bg-neutral-950 rounded-xl p-6 border-t-2 border-[#f5b210]/20",
          "hover:shadow-[0_10px_30px_rgba(245,178,16,0.15)]",
          "transition-all duration-300 ease-out group w-full max-w-[340px] mx-auto",
          "min-h-[420px] flex flex-col overflow-hidden font-[Poppins,sans-serif]"
        )}
      >
        {/* Top Bar */}
        <div className="relative mb-6 satoshi">
          {/* Pro Ribbon - Only for Featured Public Sheets */}
          {sheet.visibility === "PUBLIC" && isFeatured && (
            <div className="absolute -top-3 -right-12 bg-gradient-to-r from-[#f7c948] to-[#f0b429] text-black text-xs font-semibold px-4 py-1 transform rotate-45 shadow-md z-10 overflow-hidden w-24 text-center flex items-center justify-center gap-1 rounded-sm border border-yellow-200 transition-all duration-300 ease-in-out">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-black"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2l2.39 4.84 5.35.78-3.87 3.77.91 5.33L10 14.59 4.22 16.72l.91-5.33L1.25 7.62l5.35-.78L10 2z" />
              </svg>
              Pro
            </div>
          )}

          {/* Cloned Tag - For Cloned Sheets */}
          {sheet.isCloned && (
            <div className="absolute -top-3 -left-12 bg-gradient-to-r from-[#f7c948] to-[#f0b429] text-black text-xs font-semibold px-4 py-1 transform -rotate-45 shadow-md z-10 overflow-hidden w-24 text-center flex items-center justify-center gap-1 rounded-sm border border-yellow-200 transition-all duration-300 ease-in-out">
              Cloned
            </div>
          )}

          {/* Share and Upvote (Top Left) - Only for Public Sheets */}
          {sheet.visibility === "PUBLIC" && (
            <div className="absolute -top-3 -left-3 flex items-center gap-3 z-10">
              {(showProgress ? sheet.visibility === "PUBLIC" : true) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="text-neutral-400 hover:text-[#f5b210] transition-colors duration-200 cursor-pointer"
                        onClick={() => setIsShareOpen(!isShareOpen)}
                        aria-label="Share sheet"
                      >
                        <Share2 size={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1A1A1A] border-[#333333] text-white text-xs font-satoshi">
                      Share Sheet
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {!showProgress && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleUpvote}
                        className={cn(
                          "flex items-center gap-1 text-neutral-400",
                          isUpvoted ? "text-[#f5b210]" : "hover:text-[#f5b210]",
                          "transition-colors duration-200 cursor-pointer"
                        )}
                        aria-label={isUpvoted ? "Remove upvote" : "Upvote sheet"}
                      >
                        <TbArrowBigUpFilled
                          size={16}
                          className={isUpvoted ? "fill-[#f5b210]" : ""}
                        />
                        <span className="text-xs">{upvoteCount}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1A1A1A] border-[#333333] text-white text-xs font-satoshi">
                      {isUpvoted ? "Remove Upvote" : "Upvote Sheet"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}

          {/* Edit and Delete Icons (Top Right) - Show for all sheets on MySheetsPage */}
          {showProgress && (
            <div className="absolute -top-3 right-0 flex items-center gap-2">
              {/* Edit Icon */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="text-neutral-400 hover:text-[#f5b210] transition-colors duration-200"
                      aria-label="Edit sheet"
                    >
                      <Edit2 size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#1A1A1A] border-[#333333] text-white text-xs font-satoshi">
                    Edit Sheet
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/* Delete Icon */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleDeleteSheet(sheet.id)}
                      className="text-neutral-400 hover:text-red-500 transition-colors duration-200"
                      aria-label="Delete sheet"
                    >
                      <Trash2 size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#1A1A1A] border-[#333333] text-white text-xs font-satoshi">
                    Delete Sheet
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          <AnimatePresence>
            {isShareOpen && sheet.visibility === "PUBLIC" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-8 left-0 bg-neutral-900 border border-neutral-700/30 rounded-lg p-4 shadow-xl z-20 w-48"
                onClick={(e) => e.stopPropagation()}
              >
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => handleShare("twitter")}
                      className="flex items-center gap-2 text-neutral-300 hover:text-[#f5b210] w-full text-left text-sm transition-colors duration-200 cursor-pointer"
                    >
                      <Twitter size={16} className="text-neutral-300" />
                      Twitter
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="flex items-center gap-2 text-neutral-300 hover:text-[#f5b210] w-full text-left text-sm transition-colors duration-200 cursor-pointer"
                    >
                      <Linkedin size={16} className="text-neutral-300" />
                      LinkedIn
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-2 text-neutral-300 hover:text-[#f5b210] w-full text-left text-sm transition-colors duration-200 cursor-pointer"
                    >
                      <Copy size={16} className="text-neutral-300" />
                      Copy Link
                    </button>
                  </li>
                </ul>
                <button
                  className="absolute top-2 right-2 text-neutral-400 hover:text-[#f5b210] text-sm transition-colors duration-200 cursor-pointer"
                  onClick={() => setIsShareOpen(false)}
                  aria-label="Close share popup"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {sheet.visibility === "PUBLIC" && !showProgress && isFeatured ? (
            <div className="flex justify-center items-center gap-1 -mt-3">
              <span className="text-[#f5b210] text-sm font-semibold">★</span>
              <span className="text-[#f5b210] text-sm font-semibold">
                Featured
              </span>
            </div>
          ) : showProgress ? (
            <div className="flex justify-center items-center gap-1 -mt-3">
              <span className="text-[#f5b210] text-sm font-semibold">
                {sheet.visibility}
              </span>
            </div>
          ) : (
            <div className="h-6" />
          )}
        </div>

        {/* Progress - Show for all sheets on MySheetsPage */}
        {showProgress && (
          <div className="mb-4 arp-display">
            <div className="text-[#f5b210] text-xs font-semibold -mt-3 text-center">
              <span>Progress: </span>
              {sheet.progress
                ? `${sheet.progress.percentage.toFixed(1)}% (${
                    sheet.progress.solved
                  }/${sheet.progress.total})`
                : "0% (0/0)"}
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1 space-y-4 satoshi">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <Link to={`/sheet/${sheet.id}`}>
                <h3
                  className={cn(
                    "text-xl font-bold text-white leading-tight truncate text-center text-wrap",
                    "group-hover:text-[#f5b210] transition-colors duration-200 flex justify-center"
                  )}
                >
                  {sheet.name}
                </h3>
              </Link>
              <div className="w-full my-4">
                <div className="h-1 bg-gradient-to-r from-red-500 via-yellow-500 via-green-400 via-blue-400 to-purple-500 rounded-full" />
              </div>
            </div>
          </div>

          <p className="text-sm text-neutral-300 line-clamp-3 leading-relaxed flex-1 text-center">
            {sheet.description || "No description available"}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {sheet.tags &&
              sheet.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  className="bg-neutral-800/30 text-[#f5b210] text-xs font-medium px-2.5 py-0.5 rounded-full border border-neutral-700/30"
                >
                  {tag}
                </Badge>
              ))}
            {sheet.tags && sheet.tags.length > 3 && (
              <button
                onClick={() => openTagsModal(sheet.tags)}
                className="focus:outline-none"
              >
                <Badge
                  className={cn(
                    "bg-neutral-800/30 text-[#f5b210] text-xs font-medium px-2.5 py-0.5 rounded-full",
                    "border border-neutral-700/30 hover:bg-[#f5b210]/10 transition-colors duration-200"
                  )}
                >
                  +{sheet.tags.length - 3} more
                </Badge>
              </button>
            )}
          </div>

          <p className="text-xs text-neutral-400 truncate -mt-2">
            Created By{" "}
            {sheet.isAdminCreated
              ? "Admin"
              : showProgress
              ? user?.name || "You"
              : sheet.creator?.name || "Anonymous"}
          </p>

          <div className="grid grid-cols-1 gap-x-4 gap-y-2 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-neutral-500 flex-shrink-0" />
              <span className="truncate">
                Last Updated: {formatDate(sheet.updatedAt)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Hash size={14} className="text-neutral-500 flex-shrink-0" />
              <span className="truncate">Problems: {sheet.totalProblems}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-auto">
            {sheet.visibility === "PUBLIC" && !showProgress ? (
              <>
                <Link to={`/sheet/${sheet.id}`} className="flex-1">
                  <Button
                    aria-label={`Explore sheet ${sheet.name}`}
                    className={cn(
                      "w-full bg-[#f5b210] text-black font-medium text-sm py-2.5 rounded-lg",
                      "hover:bg-[#e4a107] transition-colors duration-200",
                      "flex items-center justify-center gap-2 cursor-pointer"
                    )}
                  >
                    Explore
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Button
                  onClick={() => handleCloneSheet(sheet.id)}
                  className={cn(
                    "text-[#f5b210] border border-[#f5b210]/30 bg-transparent text-sm py-2.5 rounded-lg",
                    "hover:bg-[#f5b210]/10 hover:border-[#f5b210] transition-colors duration-200 cursor-pointer"
                  )}
                >
                  Clone
                </Button>
              </>
            ) : (
              <Link to={`/sheet/${sheet.id}`} className="flex-1">
                <Button
                  aria-label={`Start solving sheet ${sheet.name}`}
                  className={cn(
                    "w-full bg-[#f5b210] text-black font-medium text-sm py-2.5 rounded-lg",
                    "hover:bg-[#e4a107] transition-colors duration-200",
                    "flex items-center justify-center gap-2"
                  )}
                >
                  Start Solving
                  <ArrowRight size={16} />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#1a1a1a]/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsEditModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-[#27272a]/80 backdrop-blur-md rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto border border-[#3b3b3b]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-[#e0e0e0] mb-4 flex items-center gap-2">
              <span className="w-5 h-5 text-[#f5b210]">
                <Edit2 size={16} />
              </span>
              Edit Sheet
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[#e0e0e0] mb-1"
                >
                  Sheet Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-neutral-800 text-gray-300 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f5b210]"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-[#e0e0e0] mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={editForm.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-neutral-800 text-gray-300 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f5b210] resize-y"
                  rows={3}
                />
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-[#e0e0e0] mb-1"
                >
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={editForm.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-neutral-800 text-gray-300 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f5b210]"
                  placeholder="e.g., math, algebra, calculus"
                  required
                />
              </div>

              {/* Visibility */}
              <div>
                <label
                  htmlFor="visibility"
                  className="block text-sm font-medium text-[#e0e0e0] mb-1"
                >
                  Visibility
                </label>
                <select
                  id="visibility"
                  name="visibility"
                  value={editForm.visibility}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-neutral-800 text-gray-300 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f5b210]"
                >
                  <option value="PUBLIC" disabled={sheet.isCloned}>
                    Public
                  </option>
                  <option value="PRIVATE">Private</option>
                </select>
                {sheet.isCloned && (
                  <p className="text-xs text-red-400 mt-1">
                    Cloned sheets cannot be made public.
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-neutral-700 hover:bg-neutral-600 text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#f5b210] hover:bg-[#f5b210]/80 text-black"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default SheetCard;