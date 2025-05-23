import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useSheets } from '../lib/sheets';
import { useProblems } from '../lib/problems';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Notebook, Copy, Tag, Plus, CheckCircle, XCircle, ArrowUp, ArrowDown, Edit, Bookmark, X } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import NotesModal from '../components/Sheets/NotesModal';
import Navbar from '@/components/Problems/DarkNavbar';
import { cn } from '@/lib/utils';

const SheetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const {
    currentSheet,
    sheetProblems,
    isLoading: sheetsLoading,
    error,
    fetchSheetById,
    fetchSheetProblems,
    cloneSheet,
    removeProblemFromSheet, // Add new function
    clearError,
  } = useSheets();
  const { fetchUserSolvedProblems, userSolvedProblems, isLoading: problemsLoading } = useProblems();
  const [activeTab, setActiveTab] = useState('problems');
  const [problemNotes, setProblemNotes] = useState({});
  const [isProblemNotesModalOpen, setIsProblemNotesModalOpen] = useState(false);
  const [currentProblemIdForNotes, setCurrentProblemIdForNotes] = useState(null);
  const [currentProblemNote, setCurrentProblemNote] = useState('');
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [currentTags, setCurrentTags] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });

  // Load problem notes from local storage
  useEffect(() => {
    const storedProblemNotes = localStorage.getItem(`problemNotesForSheet-${id}`);
    if (storedProblemNotes) {
      setProblemNotes(JSON.parse(storedProblemNotes));
    }
  }, [id]);

  // Save problem notes to local storage
  useEffect(() => {
    localStorage.setItem(`problemNotesForSheet-${id}`, JSON.stringify(problemNotes));
  }, [problemNotes, id]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch sheet, problems, and solved problems
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    fetchSheetById(id);
    fetchSheetProblems(id, { page: 1, limit: 20 });
    fetchUserSolvedProblems();
  }, [id, fetchSheetById, fetchSheetProblems, fetchUserSolvedProblems, authLoading, isAuthenticated]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Check if a problem is solved
  const isProblemSolved = (problemId) => {
    return userSolvedProblems.some((problem) => problem.id === problemId);
  };

  // Sorting logic (memoized)
  const sortedProblems = useMemo(() => {
    return [...sheetProblems].sort((a, b) => {
      const { key, direction } = sortConfig;
      if (key === 'difficulty') {
        const difficultyOrder = { EASY: 1, MEDIUM: 2, HARD: 3 };
        const aValue = difficultyOrder[a.difficulty] || 0;
        const bValue = difficultyOrder[b.difficulty] || 0;
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      } else if (key === 'title') {
        return direction === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (key === 'status') {
        const aSolved = isProblemSolved(a.id);
        const bSolved = isProblemSolved(b.id);
        if (aSolved === bSolved) return 0;
        if (direction === 'asc') {
          return aSolved ? -1 : 1;
        } else {
          return aSolved ? 1 : -1;
        }
      }
      return 0;
    });
  }, [sheetProblems, userSolvedProblems, sortConfig]);

  // Handlers
  const handleCloneSheet = async () => {
    try {
      await cloneSheet(id);
      toast.success('Sheet cloned successfully');
      navigate('/sheet-library');
    } catch (err) {
      toast.error(err.message || 'Failed to clone sheet');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success('Link copied!');
    });
  };

  const handleRemoveProblem = async (problemId) => {
    if (!window.confirm('Are you sure you want to remove this problem from the sheet?')) {
      return;
    }
    try {
      await removeProblemFromSheet(id, problemId);
      toast.success('Problem removed successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to remove problem');
    }
  };

  const openProblemNotesModal = (problemId, note = '') => {
    setCurrentProblemIdForNotes(problemId);
    setCurrentProblemNote(note);
    setIsProblemNotesModalOpen(true);
  };

  const saveProblemNote = () => {
    if (currentProblemIdForNotes) {
      setProblemNotes((prev) => ({
        ...prev,
        [currentProblemIdForNotes]: currentProblemNote,
      }));
    }
    setIsProblemNotesModalOpen(false);
    setCurrentProblemIdForNotes(null);
    setCurrentProblemNote('');
  };

  const clearProblemNote = () => {
    if (currentProblemIdForNotes) {
      setProblemNotes((prev) => {
        const newNotes = { ...prev };
        delete newNotes[currentProblemIdForNotes];
        return newNotes;
      });
    }
    setIsProblemNotesModalOpen(false);
    setCurrentProblemIdForNotes(null);
    setCurrentProblemNote('');
  };

  const openTagsModal = (tags) => {
    setCurrentTags(tags);
    setIsTagsModalOpen(true);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const openSheetNotesModal = (note = '') => {
    toast.info('This button could open a modal for sheet-level notes if implemented.');
  };

  if (authLoading || sheetsLoading || problemsLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f5b210]"></div>
      </div>
    );
  }

  if (!currentSheet) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white satoshi">
        <Navbar />
        <div className="h-16"></div>
        <div className="max-w-7xl mx-auto px-4 py-8 text-gray-300">
          Sheet not found.
        </div>
      </div>
    );
  }

  const isUserSheet = currentSheet.creatorId === user?.id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 text-white satoshi">
      <Toaster />
      <Navbar />
      <div className="h-16"></div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Notebook className="h-7 w-7 text-[#f5b210] drop-shadow-md" />
              <h1 className="text-3xl font-bold tracking-tight text-white">{currentSheet.name}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => openSheetNotesModal(currentSheet.description)}
                className="bg-neutral-800/80 backdrop-blur-sm hover:bg-neutral-700/80 text-gray-200 border border-neutral-600/50 flex items-center gap-2 h-10 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <Plus size={16} />
                Notes
              </Button>
              <Button
                onClick={handleCopyLink}
                className="bg-neutral-800/80 backdrop-blur-sm hover:bg-neutral-700/80 text-gray-200 border border-neutral-600/50 flex items-center gap-2 h-10 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <Copy size={16} />
                Copy Link
              </Button>
              {currentSheet.visibility === 'PUBLIC' && (
                <Button
                  onClick={handleCloneSheet}
                  className="bg-gradient-to-r from-[#f5b210] to-[#e4a107] hover:from-[#e4a107] hover:to-[#d49206] text-black font-medium flex items-center gap-2 h-10 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  Clone Sheet
                </Button>
              )}
            </div>
          </div>

          {/* Description and Tags */}
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">{currentSheet.description || 'No description'}</p>
          {currentSheet.tags && currentSheet.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {currentSheet.tags.slice(0, 2).map((tag, index) => (
                <Badge
                  key={index}
                  className="bg-neutral-800/50 backdrop-blur-sm text-[#f5b210] text-xs font-medium rounded-full px-3 py-1 border border-neutral-600/30 shadow-sm hover:bg-neutral-700/50 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
              {currentSheet.tags.length > 2 && (
                <button
                  onClick={() => openTagsModal(currentSheet.tags)}
                  className="cursor-pointer"
                >
                  <Badge className="bg-[#f5b210]/10 text-[#f5b210] text-xs rounded-full px-3 py-1 hover:bg-[#f5b210]/20 transition-colors border border-[#f5b210]/20 shadow-sm">
                    +{currentSheet.tags.length - 2} more
                  </Badge>
                </button>
              )}
            </div>
          )}

          {/* Progress Bar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="text-sm font-medium text-[#f5b210] drop-shadow-sm">
              Progress: {currentSheet.progress.percentage.toFixed(1)}% (
              {currentSheet.progress.solved}/{currentSheet.progress.total})
            </div>
            <div className="flex-1 bg-neutral-800/50 h-2 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentSheet.progress.percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-gradient-to-r from-[#f5b210] to-[#e4a107] h-2 rounded-full"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-neutral-800/80 backdrop-blur-sm border border-neutral-600/30 rounded-lg mb-6 shadow-md">
              <TabsTrigger
                value="problems"
                className="text-sm font-medium text-gray-300 data-[state=active]:text-[#f5b210] data-[state=active]:border-b-2 data-[state=active]:border-[#f5b210] px-6 py-3"
              >
                Problems
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="text-sm font-medium text-gray-300 data-[state=active]:text-[#f5b210] data-[state=active]:border-b-2 data-[state=active]:border-[#f5b210] px-6 py-3"
              >
                Sheet Notes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="problems">
              <div className="bg-neutral-900/80 backdrop-blur-md rounded-xl shadow-xl border border-neutral-700/30 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Sheet Problems</h2>
                {sortedProblems.length === 0 ? (
                  <p className="text-gray-400 text-sm">No problems available in this sheet.</p>
                ) : (
                  <div className="overflow-x-auto rounded-lg shadow-lg border border-neutral-800/50">
                    <table className="w-full border-collapse bg-neutral-900">
                      <thead>
                        <tr className="bg-gradient-to-r from-neutral-800 to-neutral-700 text-left text-sm font-semibold text-gray-300">
                          <th
                            className="p-4 w-1/12 cursor-pointer hover:text-[#f5b210] transition-colors"
                            onClick={() => handleSort('status')}
                          >
                            <div className="flex items-center gap-2">
                              Status
                              {sortConfig.key === 'status' &&
                                (sortConfig.direction === 'asc' ? (
                                  <ArrowUp className="h-3 w-3" />
                                ) : (
                                  <ArrowDown className="h-3 w-3" />
                                ))}
                            </div>
                          </th>
                          <th
                            className="p-4 w-1/3 cursor-pointer hover:text-[#f5b210] transition-colors"
                            onClick={() => handleSort('title')}
                          >
                            <div className="flex items-center gap-2">
                              Problems
                              {sortConfig.key === 'title' &&
                                (sortConfig.direction === 'asc' ? (
                                  <ArrowUp className="h-3 w-3" />
                                ) : (
                                  <ArrowDown className="h-3 w-3" />
                                ))}
                            </div>
                          </th>
                          <th
                            className="p-4 w-1/6 cursor-pointer hover:text-[#f5b210] transition-colors"
                            onClick={() => handleSort('difficulty')}
                          >
                            <div className="flex items-center gap-2">
                              Difficulty
                              {sortConfig.key === 'difficulty' &&
                                (sortConfig.direction === 'asc' ? (
                                  <ArrowUp className="h-3 w-3" />
                                ) : (
                                  <ArrowDown className="h-3 w-3" />
                                ))}
                            </div>
                          </th>
                          <th className="p-4 w-1/12 text-center">Notes</th>
                          <th className="p-4 w-1/6 text-center">Solve</th>
                          {isUserSheet && (
                            <th className="p-4 w-1/12 text-center">Actions</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {sortedProblems.map((problem, index) => (
                          <motion.tr
                            key={problem.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="border-t border-neutral-800 hover:bg-neutral-800/50 transition-colors group"
                          >
                            <td className="p-4 text-center">
                              {isProblemSolved(problem.id) ? (
                                <div className="flex items-center justify-center gap-1 text-[#28a056] font-medium">
                                  <CheckCircle size={14} className="text-[#28a056]" />
                                  Solved
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-1 text-[#EF4444] font-medium">
                                  <XCircle size={14} className="text-[#EF4444]" />
                                  Unsolved
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <Link
                                to={`/problem/${problem.id}`}
                                className="text-md font-medium text-white hover:text-[#f5b210] block"
                              >
                                {problem.title}
                              </Link>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {problem.tags &&
                                  problem.tags.slice(0, 2).map((tag, tagIndex) => (
                                    <Badge
                                      key={tagIndex}
                                      className="bg-transparent text-[#f5b210] text-xs font-medium rounded-sm"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                {problem.tags && problem.tags.length > 2 && (
                                  <button
                                    onClick={() => openTagsModal(problem.tags)}
                                    className="cursor-pointer"
                                  >
                                    <Badge className="bg-[#f5b210]/7 text-[#f5b210] text-xs rounded-sm px-1 py-0.5 hover:bg-[#f5b210]/20 transition-colors">
                                      +{problem.tags.length - 2} more
                                    </Badge>
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge
                                className={`border rounded-sm font-medium ${getDifficultyColor(
                                  problem.difficulty
                                )}`}
                              >
                                {problem.difficulty?.charAt(0) +
                                  problem.difficulty?.slice(1).toLowerCase()}
                              </Badge>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() =>
                                  openProblemNotesModal(
                                    problem.id,
                                    problemNotes[problem.id] || ''
                                  )
                                }
                                className="text-gray-400 hover:text-[#f5b210] transition-colors cursor-pointer"
                              >
                                {problemNotes[problem.id] ? <Edit size={20} /> : <Plus size={20} />}
                              </button>
                            </td>
                            <td className="p-4 text-center">
                              <Link to={`/problem/${problem.id}`}>
                                <button className="border border-[#f5b210] text-[#f5b210] px-4 py-1 rounded-sm text-sm font-medium group-hover:bg-[#f5b210] group-hover:text-black transition-colors cursor-pointer">
                                  Solve
                                </button>
                              </Link>
                            </td>
                            {isUserSheet && (
                              <td className="p-4 text-center">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        onClick={() => handleRemoveProblem(problem.id)}
                                        className="text-gray-400 hover:text-[#ef4444] transition-colors cursor-pointer"
                                      >
                                        <X size={20} />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-neutral-800 text-white border-neutral-700">
                                      Remove Problem
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </td>
                            )}
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="notes">
              <div className="bg-neutral-900/80 backdrop-blur-md rounded-xl shadow-xl border border-neutral-700/30 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Sheet-Level Notes</h2>
                {currentSheet.notes ? (
                  <p className="text-gray-300 leading-relaxed">{currentSheet.notes}</p>
                ) : (
                  <p className="text-gray-300">No notes available for this sheet. Add a note to get started.</p>
                )}
                <Button
                  onClick={() => openSheetNotesModal(currentSheet.notes || '')}
                  className="mt-4 bg-gradient-to-r from-[#f5b210] to-[#e4a107] hover:from-[#e4a107] hover:to-[#d49206] text-black font-medium rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  {currentSheet.notes ? 'Edit Sheet Note' : 'Add Sheet Note'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <NotesModal
        isOpen={isProblemNotesModalOpen}
        onClose={() => setIsProblemNotesModalOpen(false)}
        currentNote={currentProblemNote}
        setCurrentNote={setCurrentProblemNote}
        saveNote={saveProblemNote}
        clearNote={clearProblemNote}
      />

      {isTagsModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#1a1a1a]/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsTagsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-[#27272a]/90 backdrop-blur-md rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto border border-neutral-600/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-[#e0e0e0] mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#f5b210] drop-shadow-sm" />
              All Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentTags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-neutral-800/50 backdrop-blur-sm text-[#f5b210] px-3 py-1 rounded-full text-sm font-medium border border-neutral-600/30 shadow-sm hover:bg-neutral-700/50 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setIsTagsModalOpen(false)}
                className="bg-gradient-to-r from-[#f5b210] to-[#e4a107] hover:from-[#e4a107] hover:to-[#d49206] text-black font-medium rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'EASY':
      return 'bg-[#28a056]/20 text-[#28a056] border-[#28a056]/50 hover:bg-[#28a056]/30';
    case 'MEDIUM':
      return 'bg-[#f5b210]/20 text-[#f5b210] border-[#f5b210]/50 hover:bg-[#f5b210]/30';
    case 'HARD':
      return 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/50 hover:bg-[#ef4444]/30';
    default:
      return 'bg-gray-600/20 text-gray-600 border-gray-600/50 hover:bg-gray-600/30';
  }
};

export default SheetDetailPage;