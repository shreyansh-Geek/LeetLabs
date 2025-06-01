import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { Toaster, toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useSheets } from '../lib/sheets';
import { Button } from '@/components/ui/button';
import { Search, Plus, ArrowUpDown } from 'lucide-react';
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
import CreateSheetModal from '@/components/Sheets/CreateSheetModal'; // Import the new modal

const MySheetsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const {
    userSheets,
    isLoading: sheetsLoading,
    error,
    fetchUserSheets,
    createSheet,
    cloneSheet,
    deleteSheetById,
    updateSheetById,
    clearError,
  } = useSheets();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [tagFilter, setTagFilter] = useState([]);
  const [filteredSheets, setFilteredSheets] = useState([]);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [currentTags, setCurrentTags] = useState([]);
  const [isTagsFilterModalOpen, setIsTagsFilterModalOpen] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  const [isCreateSheetModalOpen, setIsCreateSheetModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(searchQuery, 300);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch user sheets
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    const fetchData = async () => {
      try {
        await fetchUserSheets();
      } catch (err) {
        toast.error(err.message || 'Failed to load sheets');
      }
    };
    fetchData();
  }, [fetchUserSheets, authLoading, isAuthenticated]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Filter and sort sheets
  useEffect(() => {
    let filtered = userSheets;

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

    setFilteredSheets(filtered);
  }, [userSheets, debouncedSearch, tagFilter, sortBy]);

  // Calculate tag counts
  const calculateTagCounts = () => {
    const tagCounts = {};
    userSheets.forEach((sheet) => {
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

  const handleCreateSheet = () => {
    setIsCreateSheetModalOpen(true);
  };

  const handleCloneSheet = async (sheetId) => {
    try {
      await cloneSheet(sheetId);
      toast.success('Sheet cloned successfully');
      await fetchUserSheets();
    } catch (err) {
      toast.error('Failed to clone sheet');
    }
  };

  const handleDeleteSheet = async (sheetId) => {
    if (!window.confirm('Are you sure you want to delete this sheet? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteSheetById(sheetId);
      toast.success('Sheet deleted successfully');
    } catch (err) {
      toast.error('Failed to delete sheet');
    }
  };

  const handleEditSheet = async (sheetId, updatedSheet) => {
    try {
      await updateSheetById(sheetId, updatedSheet);
    } catch (err) {
      throw err;
    }
  };

  if (authLoading || sheetsLoading) {
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
      <div className="h-16"></div>
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-semibold text-white">My Sheets</h1>
              <div className="flex items-center gap-3 w-full sm:w-auto">
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 bg-neutral-800 text-gray-300 border border-neutral-700 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#f5b210] h-10"
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
                <Button
                  onClick={handleCreateSheet}
                  className="bg-[#f5b210] hover:bg-[#f5b210]/80 text-black font-medium flex items-center gap-2 h-10"
                >
                  <Plus size={16} />
                  New Sheet
                </Button>
              </div>
            </div>
          </div>
          <div>
            {filteredSheets.length === 0 ? (
              <p className="text-gray-300">No sheets available at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSheets.slice(0, 8).map((sheet, index) => (
                  <SheetCard
                    key={sheet.id}
                    sheet={sheet}
                    index={index}
                    isFeatured={false}
                    openTagsModal={openTagsModal}
                    handleCloneSheet={handleCloneSheet}
                    handleDeleteSheet={handleDeleteSheet}
                    handleEditSheet={handleEditSheet}
                    user={user}
                    showProgress={true}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Create Sheet Modal */}
      <CreateSheetModal
        isOpen={isCreateSheetModalOpen}
        onClose={() => setIsCreateSheetModalOpen(false)}
        createSheet={async (sheetData) => {
          try {
            await createSheet(sheetData);
            await fetchUserSheets(); // Refresh sheets list
          } catch (err) {
            throw err; // Let the modal handle the error
          }
        }}
        isLoading={sheetsLoading}
      />

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

export default MySheetsPage;