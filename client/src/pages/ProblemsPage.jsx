import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { useAuth } from '../lib/auth.js';
import { useProblems } from '../lib/problems.js';
import { useSheets } from '../lib/sheets.js'; // Import useSheets
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { IconFileText } from '@tabler/icons-react';
import {
  Check,
  Plus,
  Edit,
  Bookmark,
  Search,
  Tag,
  ArrowUpDown,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '../components/ui/dropdown-menu.jsx';
import FilterModal from '../components/Problems/FilterModal.jsx';
import FilterSidebar from '../components/Problems/FilterSidebar.jsx';
import NotesModal from '../components/Problems/NotesModal.jsx';
import AddToSheetModal from '../components/Sheets/AddToSheetModal.jsx';
import Navbar from '../components/Problems/DarkNavbar.jsx';

const ProblemsPage = () => {
  const { isAuthenticated, user, isLoading: authLoading, logout } = useAuth();
  const {
    problems,
    userSolvedProblems,
    isLoading: problemsLoading,
    error: problemsError,
    fetchAllProblems,
    fetchUserSolvedProblems,
    clearError: clearProblemsError,
  } = useProblems();
  const {
    userSheets,
    isLoading: sheetsLoading,
    error: sheetsError,
    fetchUserSheets,
    createSheet,
    addProblemToSheet,
    clearError: clearSheetsError,
  } = useSheets(); // Use useSheets
  const navigate = useNavigate();
  const [difficultyFilter, setDifficultyFilter] = useState([]);
  const [topicFilter, setTopicFilter] = useState([]);
  const [companyFilter, setCompanyFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [isCompaniesOpen, setIsCompaniesOpen] = useState(true);
  const [isTopicsOpen, setIsTopicsOpen] = useState(true);
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(true);
  const [isStatusOpen, setIsStatusOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [notes, setNotes] = useState({});
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [currentProblemId, setCurrentProblemId] = useState(null);
  const [currentNote, setCurrentNote] = useState('');
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [currentTags, setCurrentTags] = useState([]);
  const [isCompaniesModalOpen, setIsCompaniesModalOpen] = useState(false);
  const [isTopicsModalOpen, setIsTopicsModalOpen] = useState(false);
  const [isAddToSheetModalOpen, setIsAddToSheetModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const KNOWN_COMPANIES = [
    'Google', 'Amazon', 'Microsoft', 'Facebook', 'Apple', 'Atlassian', 'Uber', 'Bloomberg', 'Adobe', 'Cisco', 'Tcs', 'Infosys', 'Goldman Sachs', 'JP Morgan', 'Paypal', 'Zoho', 'VM Ware', 'Oracle'
  ];
  const DEMO_PROBLEM_IDS = [
  'b1148104-6d38-48aa-9f7f-a57d4ee1785c', // Valid Palindrome
  '487eb8ba-4b44-425c-a5eb-1e2aa1c8f208', // Climbing Stairs
  '3c4ee5b2-cc9a-41e0-99b8-1ae9f068f1d6', // Container With Most Water
];

  // Load notes from local storage on mount
  useEffect(() => {
    const storedNotes = localStorage.getItem('problemNotes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  // Save notes to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('problemNotes', JSON.stringify(notes));
  }, [notes]);

  // Fetch problems and user sheets when authenticated
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        await Promise.all([fetchAllProblems(), fetchUserSolvedProblems(), fetchUserSheets()]);
      } catch (err) {
        // Errors are handled by hooks
      }
    };

    fetchData();
  }, [isAuthenticated, authLoading, fetchAllProblems, fetchUserSolvedProblems, fetchUserSheets, navigate]);

  // Show toast for errors
  useEffect(() => {
    if (problemsError) {
      toast.error(problemsError);
      clearProblemsError();
    }
    if (sheetsError) {
      toast.error(sheetsError);
      clearSheetsError();
    }
  }, [problemsError, sheetsError, clearProblemsError, clearSheetsError]);

  // Calculate counts for filters
  const calculateFilterCounts = () => {
    const companyCounts = {};
    const topicCounts = {};
    const difficultyCounts = { EASY: 0, MEDIUM: 0, HARD: 0 };
    const statusCounts = { Solved: 0, Unsolved: 0 };

    problems.forEach((problem) => {
      if (problem.tags && Array.isArray(problem.tags)) {
        problem.tags.forEach((tag) => {
          if (KNOWN_COMPANIES.includes(tag)) {
            companyCounts[tag] = (companyCounts[tag] || 0) + 1;
          } else {
            topicCounts[tag] = (topicCounts[tag] || 0) + 1;
          }
        });
      }
      if (problem.difficulty) {
        difficultyCounts[problem.difficulty] = (difficultyCounts[problem.difficulty] || 0) + 1;
      }
      const isSolved = userSolvedProblems.some((p) => p.id === problem.id);
      if (isSolved) {
        statusCounts.Solved += 1;
      } else {
        statusCounts.Unsolved += 1;
      }
    });

    return { companyCounts, topicCounts, difficultyCounts, statusCounts };
  };

  // Filter and sort problems
  useEffect(() => {
  let filtered = problems;

  // Apply filters
  if (difficultyFilter.length > 0) {
    filtered = filtered.filter((problem) => difficultyFilter.includes(problem.difficulty));
  }
  if (topicFilter.length > 0) {
    filtered = filtered.filter((problem) =>
      problem.tags.some((tag) => topicFilter.includes(tag) && !KNOWN_COMPANIES.includes(tag))
    );
  }
  if (companyFilter.length > 0) {
    filtered = filtered.filter((problem) =>
      problem.tags.some((tag) => companyFilter.includes(tag) && KNOWN_COMPANIES.includes(tag))
    );
  }
  if (statusFilter.length > 0) {
    filtered = filtered.filter((problem) => {
      const isSolved = userSolvedProblems.some((p) => p.id === problem.id);
      if (statusFilter.includes('Solved') && isSolved) return true;
      if (statusFilter.includes('Unsolved') && !isSolved) return true;
      return false;
    });
  }
  if (searchQuery) {
    filtered = filtered.filter(
      (problem) =>
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Sort problems: Demo problems first, then apply other sorting
  filtered = [...filtered].sort((a, b) => {
    const isADemo = DEMO_PROBLEM_IDS.includes(a.id);
    const isBDemo = DEMO_PROBLEM_IDS.includes(b.id);

    // Prioritize demo problems
    if (isADemo && !isBDemo) return -1;
    if (!isADemo && isBDemo) return 1;

    // Apply difficulty sorting if selected, otherwise maintain default order
    if (sortBy === 'difficulty') {
      const order = { EASY: 1, MEDIUM: 2, HARD: 3 };
      return order[a.difficulty] - order[b.difficulty];
    }
    return 0; // Default order for non-demo problems if no sorting
  });

  setFilteredProblems(filtered);
}, [problems, difficultyFilter, topicFilter, companyFilter, statusFilter, searchQuery, sortBy, userSolvedProblems]);

  const isProblemSolved = (problemId) => {
    return userSolvedProblems.some((problem) => problem.id === problemId);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-[#28a056]/20 text-[#28a056] border-[#28a056]';
      case 'MEDIUM':
        return 'bg-[#f5b210]/20 text-[#f5b210] border-[#f5b210]';
      case 'HARD':
        return 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]';
      default:
        return 'bg-gray-600/20 text-gray-600 border-gray-600';
    }
  };

  // Filter handler functions
  const handleDifficultyFilter = (difficulty) => {
    setDifficultyFilter((prev) =>
      prev.includes(difficulty)
        ? prev.filter((item) => item !== difficulty)
        : [...prev, difficulty]
    );
  };

  const handleTopicFilter = (topic) => {
    setTopicFilter((prev) =>
      prev.includes(topic)
        ? prev.filter((item) => item !== topic)
        : [...prev, topic]
    );
  };

  const handleCompanyFilter = (company) => {
    setCompanyFilter((prev) =>
      prev.includes(company)
        ? prev.filter((item) => item !== company)
        : [...prev, company]
    );
  };

  const handleStatusFilter = (status) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((item) => item !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setDifficultyFilter([]);
    setTopicFilter([]);
    setCompanyFilter([]);
    setStatusFilter([]);
  };

  const openNotesModal = (problemId, note = '') => {
    setCurrentProblemId(problemId);
    setCurrentNote(note);
    setIsNotesModalOpen(true);
  };

  const saveNote = () => {
    if (currentProblemId) {
      setNotes((prev) => ({
        ...prev,
        [currentProblemId]: currentNote,
      }));
    }
    setIsNotesModalOpen(false);
    setCurrentProblemId(null);
    setCurrentNote('');
  };

  const clearNote = () => {
    if (currentProblemId) {
      setNotes((prev) => {
        const newNotes = { ...prev };
        delete newNotes[currentProblemId];
        return newNotes;
      });
    }
    setIsNotesModalOpen(false);
    setCurrentProblemId(null);
    setCurrentNote('');
  };

  const openTagsModal = (tags) => {
    setCurrentTags(tags);
    setIsTagsModalOpen(true);
  };

  const openAddToSheetModal = (problemId) => {
    setSelectedProblemId(problemId);
    setIsAddToSheetModalOpen(true);
  };

  // Handle Escape key to close modals
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsAddToSheetModalOpen(false);
        setIsNotesModalOpen(false);
        setIsTagsModalOpen(false);
        setIsCompaniesModalOpen(false);
        setIsTopicsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (authLoading || problemsLoading || sheetsLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f5b210]"></div>
      </div>
    );
  }

  const { companyCounts, topicCounts, difficultyCounts, statusCounts } = calculateFilterCounts();

  const companies = Object.keys(companyCounts)
    .map((company) => ({
      name: company,
      count: companyCounts[company],
    }))
    .sort((a, b) => b.count - a.count);

  const topics = Object.keys(topicCounts)
    .map((topic) => ({
      name: topic,
      count: topicCounts[topic],
    }))
    .sort((a, b) => b.count - a.count);

  const difficulties = ['EASY', 'MEDIUM', 'HARD'].map((difficulty) => ({
    name: difficulty,
    count: difficultyCounts[difficulty] || 0,
  }));

  const statuses = ['Solved', 'Unsolved'].map((status) => ({
    name: status,
    count: statusCounts[status] || 0,
  }));

  const displayedCompanies = companies.slice(0, 6);
  const displayedTopics = topics.slice(0, 6);

  return (
    <div className="min-h-screen bg-neutral-950 text-white satoshi">
      <Toaster />
      <Navbar />
      <div className="h-16"></div> {/* Spacer for fixed navbar */}

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <FilterSidebar
          difficultyFilter={difficultyFilter}
          topicFilter={topicFilter}
          companyFilter={companyFilter}
          statusFilter={statusFilter}
          handleDifficultyFilter={handleDifficultyFilter}
          handleTopicFilter={handleTopicFilter}
          handleCompanyFilter={handleCompanyFilter}
          handleStatusFilter={handleStatusFilter}
          clearFilters={clearFilters}
          companies={companies}
          topics={topics}
          difficulties={difficulties}
          statuses={statuses}
          isCompaniesOpen={isCompaniesOpen}
          isTopicsOpen={isTopicsOpen}
          isDifficultyOpen={isDifficultyOpen}
          isStatusOpen={isStatusOpen}
          setIsCompaniesOpen={setIsCompaniesOpen}
          setIsTopicsOpen={setIsTopicsOpen}
          setIsDifficultyOpen={setIsDifficultyOpen}
          setIsStatusOpen={setIsStatusOpen}
          setIsCompaniesModalOpen={setIsCompaniesModalOpen}
          setIsTopicsModalOpen={setIsTopicsModalOpen}
          displayedCompanies={displayedCompanies}
          displayedTopics={displayedTopics}
        />

        {/* Problem Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-semibold text-white">Practice Problems</h1>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Search Bar */}
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search problems or tags..."
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
                      className="flex items-center gap-2 bg-neutral-800 text-gray-300 border border-neutral-700 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#f5b210] h-10"
                    >
                      <ArrowUpDown size={16} className="text-[#f5b210]" />
                      <span className="text-sm">{sortBy === 'default' ? 'Sort: Default' : 'Sort: Difficulty'}</span>
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
                      onClick={() => setSortBy('difficulty')}
                      className="hover:bg-neutral-700 focus:bg-neutral-700"
                    >
                      Difficulty
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Link to="/sheets/my">
                    <Button className="bg-neutral-800 hover:bg-neutral-700 text-gray-300 border border-neutral-700 flex items-center gap-2 h-10">
                      <IconFileText size={20} />
                      My Sheets
                    </Button>
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link to="/profile/add-problem">
                      <Button className="bg-[#f5b210] hover:bg-[#f5b210]/80 text-black font-medium flex items-center gap-2 h-10">
                        <Plus size={16} />
                        Add Problem
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {filteredProblems.length === 0 ? (
            <p className="text-gray-300">No problems available at the moment.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-lg border border-neutral-800/50">
              <table className="w-full border-collapse bg-neutral-900">
                <thead>
                  <tr className="bg-gradient-to-r from-neutral-800 to-neutral-700 text-left text-sm font-semibold text-gray-300">
                    <th className="p-4 w-1/3">Problems</th>
                    <th className="p-4 w-1/6">Difficulty</th>
                    <th className="p-4 w-1/6 text-center">Status</th>
                    <th className="p-4 w-1/12 text-center">Notes</th>
                    <th className="p-4 w-1/12 text-center">Add to Sheets</th>
                    <th className="p-4 w-1/6 text-center">Solve</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems.map((problem) => (
                    <motion.tr
                      key={problem.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-neutral-800 hover:bg-neutral-800/50 transition-colors group"
                    >
                      <td className="p-4">
  <div className="flex items-center gap-2">
    <Link
      to={`/problem/${problem.id}`}
      className="text-md font-medium text-white hover:text-[#f5b210]"
    >
      {problem.title}
    </Link>
    {DEMO_PROBLEM_IDS.includes(problem.id) && (
      <Badge className="relative bg-[#ffffff] text-[#000] text-xs font-bold rounded-sm">
        Demo
        <span class="absolute top-0.5 right-0.5 grid min-h-[12px] min-w-[12px] translate-x-2/4 -translate-y-2/4 place-items-center rounded-full bg-amber-600 py-1 px-1 text-xs text-white"></span>
      </Badge>
      
    )}
  </div>
  <div className="flex flex-wrap gap-1 mt-1">
    {problem.tags.slice(0, 2).map((tag, index) => (
      <Badge
        key={index}
        className="bg-transparent text-[#f5b210] text-xs font-medium rounded-sm"
      >
        {tag}
      </Badge>
    ))}
    {problem.tags.length > 2 && (
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
                          {problem.difficulty.charAt(0) +
                            problem.difficulty.slice(1).toLowerCase()}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        {isProblemSolved(problem.id) ? (
                          <div className="flex items-center justify-center gap-1 text-[#28a056] font-medium">
                            <Check size={14} className="text-[#28a056]" />
                            Solved
                          </div>
                        ) : (
                          <span className="text-gray-400 font-medium">-</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => openNotesModal(problem.id, notes[problem.id] || '')}
                          className="text-gray-400 hover:text-[#f5b210] transition-colors cursor-pointer"
                        >
                          {notes[problem.id] ? <Edit size={20} /> : <Plus size={20} />}
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => openAddToSheetModal(problem.id)}
                          className="text-gray-400 hover:text-[#f5b210] transition-colors cursor-pointer"
                          aria-label={`Add problem ${problem.title} to a sheet`}
                        >
                          <Bookmark size={20} />
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <Link to={`/problem/${problem.id}`}>
                          <button className="border border-[#f5b210] text-[#f5b210] px-4 py-1 rounded-sm text-sm font-medium group-hover:bg-[#f5b210] group-hover:text-black transition-colors cursor-pointer">
                            Solve
                          </button>
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Filter Modals */}
      <FilterModal
        isOpen={isCompaniesModalOpen}
        onClose={() => setIsCompaniesModalOpen(false)}
        title="Select Companies"
        items={companies}
        selectedItems={companyFilter}
        onSelectItem={handleCompanyFilter}
        onApply={() => setIsCompaniesModalOpen(false)}
      />
      <FilterModal
        isOpen={isTopicsModalOpen}
        onClose={() => setIsTopicsModalOpen(false)}
        title="Select Topics"
        items={topics}
        selectedItems={topicFilter}
        onSelectItem={handleTopicFilter}
        onApply={() => setIsTopicsModalOpen(false)}
      />

      {/* Notes Modal */}
      <NotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        currentNote={currentNote}
        setCurrentNote={setCurrentNote}
        saveNote={saveNote}
        clearNote={clearNote}
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
              <Tag className="w-5 h-5 text-[#f5b210]" />
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

      {/* Add to Sheet Modal */}
      <AddToSheetModal
        isOpen={isAddToSheetModalOpen}
        onClose={() => setIsAddToSheetModalOpen(false)}
        sheets={userSheets}
        problemId={selectedProblemId}
        addProblemToSheet={addProblemToSheet}
        createSheet={createSheet}
      />
    </div>
  );
};

export default ProblemsPage;