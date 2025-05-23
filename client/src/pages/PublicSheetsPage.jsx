import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { Toaster, toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useSheets } from '../lib/sheets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, ArrowUpDown } from 'lucide-react';
import {IconFileText} from '@tabler/icons-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import FilterSidebar from '@/components/Sheets/FilterSidebar';
import FilterModal from '@/components/Sheets/FilterModal';
import Navbar from '@/components/Problems/DarkNavbar';
import SheetCard from '@/components/Sheets/SheetCard';

const PublicSheetsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const {
    publicSheets,
    featuredSheets,
    isLoading: sheetsLoading,
    error,
    fetchPublicSheets,
    fetchFeaturedSheets,
    cloneSheet, // Added cloneSheet from useSheets
    clearError,
  } = useSheets();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [tagFilter, setTagFilter] = useState([]);
  const [filteredPublicSheets, setFilteredPublicSheets] = useState([]);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [currentTags, setCurrentTags] = useState([]);
  const [isTagsFilterModalOpen, setIsTagsFilterModalOpen] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const [debouncedSearch] = useDebounce(searchQuery, 300);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch sheets
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    const fetchData = async () => {
      try {
        // Only fetch featured sheets on initial load
        if (page === 1) {
          await fetchFeaturedSheets();
        }
        const response = await fetchPublicSheets({
          search: debouncedSearch,
          page,
          limit: 8, // 4 cards per row, 2 rows
          tags: tagFilter,
        });
        setTotalPages(Math.ceil(response.total / 8));
        setHasMore(page < Math.ceil(response.total / 8));
      } catch (err) {
        toast.error(err.message || 'Failed to load sheets');
      }
    };
    fetchData();
  }, [page, debouncedSearch, tagFilter, fetchPublicSheets, fetchFeaturedSheets, authLoading, isAuthenticated]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Filter and sort public sheets
  useEffect(() => {
    let filtered = publicSheets;

    if (debouncedSearch) {
      filtered = filtered.filter(
        (sheet) =>
          sheet.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          (sheet.tags && sheet.tags.some((tag) => tag.toLowerCase().includes(debouncedSearch.toLowerCase())))
      );
    }

    if (tagFilter.length > 0) {
      filtered = filtered.filter(
        (sheet) => sheet.tags && sheet.tags.some((tag) => tagFilter.includes(tag))
      );
    }

    if (sortBy === 'name') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'problems') {
      filtered = [...filtered].sort((a, b) => b.totalProblems - a.totalProblems);
    } else if (sortBy === 'updated') {
      filtered = [...filtered].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } else if (sortBy === 'upvotes') {
      filtered = [...filtered].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    }

    setFilteredPublicSheets(filtered);
  }, [publicSheets, debouncedSearch, tagFilter, sortBy]);

  // Reset page to 1 when search or tag filters change
  useEffect(() => {
    setPage(1);
    setFilteredPublicSheets([]);
    setHasMore(true);
  }, [debouncedSearch, tagFilter]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (sheetsLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [sheetsLoading, hasMore]);

  // Calculate tag counts
  const calculateTagCounts = () => {
    const tagCounts = {};
    const allSheets = [...publicSheets, ...featuredSheets];
    allSheets.forEach((sheet) => {
      if (sheet.tags && Array.isArray(sheet.tags)) {
        sheet.tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    return Object.keys(tagCounts)
      .map((tag) => ({
        name: tag,
        count: tagCounts[tag],
      }))
      .sort((a, b) => b.count - a.count);
  };

  const tags = calculateTagCounts();
  const displayedTags = tags.slice(0, 6);

  // Handlers
  const handleTagFilter = (tag) => {
    setTagFilter((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setTagFilter([]);
  };

  const openTagsModal = (tags) => {
    setCurrentTags(tags);
    setIsTagsModalOpen(true);
  };

  const handleMySheets = () => {
    navigate('/sheets/my');
  };

  // Handle sheet cloning
  const handleCloneSheet = async (sheetId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to clone a sheet');
      navigate('/login');
      return;
    }
    try {
      await cloneSheet(sheetId);
      toast.success('Sheet cloned successfully');
    } catch (err) {
      toast.error('Failed to clone sheet');
    }
  };

  if (authLoading || (sheetsLoading && page === 1)) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-neutral-950 to-neutral-900">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f5b210]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 to-neutral-900 text-white satoshi">
      <Toaster />
      <Navbar />
      <div className="h-16"></div> {/* Spacer for fixed navbar */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <FilterSidebar
          tagFilter={tagFilter}
          handleTagFilter={handleTagFilter}
          clearFilters={clearFilters}
          tags={tags}
          displayedTags={displayedTags}
          isTagsOpen={isTagsOpen}
          setIsTagsOpen={setIsTagsOpen}
          setIsTagsFilterModalOpen={setIsTagsFilterModalOpen}
        />

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-semibold text-white">Public Sheets Library</h1>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Search Bar */}
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search sheets or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 text-sm rounded-lg bg-neutral-800 text-gray-300 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#f5b210] w-full sm:w-64 h-10"
                  />
                </div>
                {/* Sort By */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 bg-neutral-800 text-gray-300 border border-neutral-700 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#f5b210] h-10 cursor-pointer"
                    >
                      <ArrowUpDown size={16} className="text-[#f5b210]" />
                      <span className="text-sm">
                        {sortBy === 'default'
                          ? 'Sort: Default'
                          : sortBy === 'name'
                          ? 'Sort: Name'
                          : sortBy === 'problems'
                          ? 'Sort: Problems'
                          : sortBy === 'updated'
                          ? 'Sort: Updated'
                          : 'Sort: Upvotes'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-neutral-800 text-gray-300 border border-neutral-700">
                    <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => setSortBy('default')}
                      className="hover:bg-neutral-700 focus:bg-neutral-700"
                    >
                      Default
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortBy('name')}
                      className="hover:bg-neutral-700 focus:bg-neutral-700"
                    >
                      Name
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortBy('problems')}
                      className="hover:bg-neutral-700 focus:bg-neutral-700"
                    >
                      Number of Problems
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortBy('updated')}
                      className="hover:bg-neutral-700 focus:bg-neutral-700"
                    >
                      Last Updated
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortBy('upvotes')}
                      className="hover:bg-neutral-700 focus:bg-neutral-700"
                    >
                      Upvotes
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Action Button */}
                <Button
                  onClick={handleMySheets}
                  className="bg-[#f5b210] hover:bg-[#f5b210]/80 text-black font-medium flex items-center gap-2 h-10 cursor-pointer"
                >
                  <IconFileText size={16} />
                  My Sheets
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Sheets */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Featured Sheets</h2>
            {featuredSheets.length === 0 ? (
              <p className="text-gray-300">No featured sheets available at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredSheets.slice(0, 8).map((sheet, index) => (
                  <SheetCard
                    key={sheet.id}
                    sheet={sheet}
                    index={index}
                    isFeatured={true}
                    openTagsModal={openTagsModal}
                    handleCloneSheet={handleCloneSheet} // Added prop
                    user={user} // Added prop
                    showProgress={false} // Added prop for clarity
                  />
                ))}
              </div>
            )}
          </div>

          {/* Public Sheets */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Public Sheets</h2>
            {filteredPublicSheets.length === 0 ? (
              <p className="text-gray-300">No public sheets available at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPublicSheets.map((sheet, index) => (
                  <SheetCard
                    key={sheet.id}
                    sheet={sheet}
                    index={index}
                    isFeatured={false}
                    openTagsModal={openTagsModal}
                    handleCloneSheet={handleCloneSheet} // Added prop
                    user={user} // Added prop
                    showProgress={false} // Added prop for clarity
                  />
                ))}
              </div>
            )}
            <div ref={loadMoreRef} className="h-10"></div>
            {sheetsLoading && (
              <div className="flex justify-center items-center mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f5b210]"></div>
              </div>
            )}
            {!hasMore && filteredPublicSheets.length > 0 && (
              <p className="text-gray-300 text-center mt-4">No more sheets to load.</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Tags Modal */}
      {isTagsModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#1a1a1a]/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsTagsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-[#27272a]/80 backdrop-blur-md rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto border border-[#3b3b3b]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-[#e0e0e0] mb-4 flex items-center gap-2">
              <span className="w-5 h-5 text-[#f5b210]">🏷️</span>
              All Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentTags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-[#3b3b3b] text-[#f5b210] px-3 py-1 rounded-md text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setIsTagsModalOpen(false)}
                className="bg-[#f5b210] hover:bg-[#f5b210]/80 text-black cursor-pointer"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={isTagsFilterModalOpen}
        onClose={() => setIsTagsFilterModalOpen(false)}
        title="Select Tags"
        items={tags}
        selectedItems={tagFilter}
        onSelectItem={handleTagFilter}
        onApply={() => setIsTagsFilterModalOpen(false)}
      />
    </div>
  );
};

export default PublicSheetsPage;