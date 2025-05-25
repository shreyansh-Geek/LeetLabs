// src/components/Problems/ProblemDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Code, BookOpen, Clock, PenSquare, MessageSquare, ChevronLeft, ChevronRight, Share2, Maximize, Minimize, X } from 'lucide-react';
import { IconReport, IconSparkles } from '@tabler/icons-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ProblemSidebar from '../components/Workspace/ProblemSidebar';
import Timer from '../components/Workspace/Timer';
import { useProblems } from '../lib/problems';
import { useWorkspace } from '../lib/workspace';
import { withRetry, getCodeStub } from '../lib/utils';
import {
  Description,
  Editorial,
  Submissions,
  Notes,
  AIDiscussions,
  CodeEditor,
  TestCases,
} from '@/components/Workspace';

// Schemas
const notesSchema = z.object({
  notes: z.string().max(5000, 'Notes cannot exceed 5000 characters').optional(),
});

const testCaseSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  output: z.string().min(1, 'Output is required'),
});

const ProblemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchAllProblems, fetchProblemById, isLoading: isProblemLoading, error: problemError, problems = [] } = useProblems();
  const {
    fetchSubmissionsForProblem,
    fetchNotes,
    saveNotes: saveNotesApi,
    runCode,
    submitCode,
    submissions,
    notes,
    output,
    isLoading: isWorkspaceLoading,
    isRunning,
    isSubmitting,
    error: workspaceError,
  } = useWorkspace();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('JAVASCRIPT');
  const [code, setCode] = useState('');
  const [customTestCases, setCustomTestCases] = useState([]);
  const [isTestCasePanelOpen, setIsTestCasePanelOpen] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTestCaseId, setActiveTestCaseId] = useState(0);
  const [showTestCases, setShowTestCases] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isTestCasesCollapsed, setIsTestCasesCollapsed] = useState(false);
  const [panelSizes, setPanelSizes] = useState(() => {
    const saved = localStorage.getItem(`panelSizes-${id}`);
    return saved ? JSON.parse(saved) : [60, 40];
  });
  const [isNotesLoading, setIsNotesLoading] = useState(true);
  const [hasRunCode, setHasRunCode] = useState(false);
  const [activeTestTab, setActiveTestTab] = useState('test-cases');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    resolver: zodResolver(notesSchema),
    defaultValues: {
      notes: '',
    },
  });

  useEffect(() => {
    if (notes !== undefined) {
      reset({ notes: notes ?? '' }, { keepDefaultValues: true });
    }
  }, [notes, reset]);

  const {
    register: registerTestCase,
    handleSubmit: handleTestCaseSubmit,
    formState: { errors: testCaseErrors },
    reset: resetTestCase,
  } = useForm({
    resolver: zodResolver(testCaseSchema),
  });

  // Navigation handlers
  const handleProblemChange = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  const handlePrevProblem = () => {
    const currentIndex = problems.findIndex((p) => p.id === id);
    if (currentIndex > 0) {
      navigate(`/problem/${problems[currentIndex - 1].id}`);
    }
  };

  const handleNextProblem = () => {
    const currentIndex = problems.findIndex((p) => p.id === id);
    if (currentIndex < problems.length - 1 && currentIndex !== -1) {
      navigate(`/problem/${problems[currentIndex + 1].id}`);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success('Link copied!');
    });
  };

  // Fetch problem, submissions, and notes
  useEffect(() => {
    const fetchData = async () => {
      setIsNotesLoading(true);
      try {
        let problemResponse;
        try {
          problemResponse = await withRetry(() => fetchProblemById(id), { retries: 3 });
          setProblem(problemResponse.problem);
          const codeSnippet = getCodeStub(problemResponse.problem, language);
          setCode(codeSnippet);
        } catch (err) {
          toast.error('Failed to load problem data.');
          return;
        }

        try {
          await withRetry(() => fetchSubmissionsForProblem(id), {
            retries: 1,
            shouldRetry: (err) => err.status !== 404,
          });
        } catch (err) {
          console.warn('Submissions fetch warning:', err);
          toast.warning('No submissions found.');
        }

        try {
          const response = await withRetry(() => fetchNotes(id), { retries: 3 });
        } catch (err) {
          console.warn('Notes fetch warning:', err);
          toast.warning('No notes found.');
        }
      } catch (err) {
        console.error('Unexpected fetch error:', err);
        toast.error('Failed to load data. Please refresh or try again.');
      } finally {
        setIsNotesLoading(false);
      }
    };
    fetchData();
  }, [id, fetchProblemById, fetchSubmissionsForProblem, fetchNotes, language]);

  useEffect(() => {
    const fetchProblemsData = async () => {
      try {
        await withRetry(() => fetchAllProblems(), { retries: 3 });
      } catch (err) {
        console.error('Failed to fetch problems:', err);
        toast.error('Failed to load problems list.');
      }
    };
    fetchProblemsData();
  }, [fetchAllProblems]);

  // Auto-save code to localStorage
  useEffect(() => {
    localStorage.setItem(`code-${id}-${language}`, code);
  }, [code, id, language]);

  // Save panel sizes to localStorage
  useEffect(() => {
    localStorage.setItem(`panelSizes-${id}`, JSON.stringify(panelSizes));
  }, [panelSizes, id]);

  // Save notes
  const saveNotes = async (data) => {
    try {
      await saveNotesApi(id, data.notes);
      toast.success('Notes saved!');
    } catch (err) {
      toast.error('Failed to save notes');
    }
  };

  // Add custom test case
  const addCustomTestCase = (data) => {
    setCustomTestCases([...customTestCases, { input: data.input, output: data.output }]);
    const newTestCaseId = (problem?.testcases?.length || 0) + customTestCases.length;
    setActiveTestCaseId(newTestCaseId); // Select the new test case
    setIsTestCasePanelOpen(false); // Close the form
    resetTestCase(); // Reset form fields
    toast.success('Custom test case added!');
  };

  // Delete custom test case
  const deleteCustomTestCase = (index) => {
    const deletedTestCaseId = (problem?.testcases?.length || 0) + index;
    setCustomTestCases(customTestCases.filter((_, i) => i !== index));
    if (activeTestCaseId === deletedTestCaseId) {
      // If the deleted test case was active, select the previous test case
      const newId = Math.max(0, deletedTestCaseId - 1);
      setActiveTestCaseId(newId);
    } else if (activeTestCaseId > deletedTestCaseId) {
      // Adjust activeTestCaseId if it was after the deleted test case
      setActiveTestCaseId(activeTestCaseId - 1);
    }
    toast.success('Custom test case deleted!');
  };

  // Copy code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success('Code copied!');
    });
  };

  // Reset code
  const handleResetCode = () => {
    const codeSnippet = getCodeStub(problem, language);
    setCode(codeSnippet);
    toast.success('Code reset!');
  };

  // Handle full-screen toggle
  const handleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    const exitHandler = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
      } else {
        setIsFullScreen(true);
      }
    };
    document.addEventListener('fullscreenchange', exitHandler);
    return () => document.removeEventListener('fullscreenchange', exitHandler);
  }, []);

  // Debug loading and error states
  useEffect(() => {

  }, [isProblemLoading, isWorkspaceLoading, problemError, workspaceError, problem, isTestCasesCollapsed, panelSizes]);

  return (
    <div className="flex h-screen bg-[#1A1A1A] satoshi">
      {/* Sidebar */}
      <ProblemSidebar />
      {/* Main Content */}
      <div className="flex-1 pl-[80px] h-screen overflow-hidden">
        {isProblemLoading || isWorkspaceLoading ? (
          <div className="flex flex-col items-center justify-center h-full bg-[#1A1A1A] text-gray-300">
            <div className="relative">
              <div className="flex justify-center items-center h-screen w-screen bg-neutral-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f5b210]"></div>
      </div>
              <p className="mt-4 text-sm font-satoshi">Loading Problem...</p>
            </div>
          </div>
        ) : problemError || workspaceError ? (
          <div className="flex justify-center items-center h-full text-[#ef4444] text-sm text-center bg-[#1A1A1A]">
            <p>Error: {problemError || workspaceError}. Please refresh or try again.</p>
          </div>
        ) : !problem ? (
          <div className="flex justify-center items-center h-full text-white text-sm text-center bg-[#1A1A1A]">
            <p>No problem data available. Please try again.</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-12 p-4 flex items-center justify-between bg-[#1A1A1A] border-b border-[#333333]">
              {/* Left: Problem List and Navigation */}
              <div className="flex items-center gap-2">
                <Select
                  value={id}
                  onValueChange={handleProblemChange}
                  disabled={!problems.length}
                >
                  <SelectTrigger className="w-[210px] bg-[#1A1A1A] border-none text-white text-sm font-satoshi cursor-pointer">
                    Problem List:
                    <SelectValue placeholder="Select a problem" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#333333] text-white">
                    {problems.map((problem) => (
                      <SelectItem key={problem.id} value={problem.id} className="font-satoshi text-xs">
                        {problem.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handlePrevProblem}
                        disabled={!problems.length || problems.findIndex((p) => p.id === id) <= 0}
                        className="p-1 text-[#b3b3b3] hover:text-[#f5b210] disabled:text-[#333333] transition-all duration-300 ease-in-out cursor-pointer"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1A1A1A] border-[#333333] text-white text-xs font-satoshi">
                      Previous Problem
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleNextProblem}
                        disabled={!problems.length || problems.findIndex((p) => p.id === id) >= problems.length - 1}
                        className="p-1 text-[#b3b3b3] hover:text-[#f5b210] disabled:text-[#333333] transition-all duration-300 ease-in-out cursor-pointer"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1A1A1A] border-[#333333] text-white text-xs font-satoshi">
                      Next Problem
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {/* Middle: Timer */}
              <Timer problemId={id} />
              {/* Right: Full Screen, Share, Pro */}
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleFullScreen}
                        className="text-[#b3b3b3] hover:text-[#f5b210] transition-all duration-300 ease-in-out cursor-pointer"
                      >
                        {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1A1A1A] border-[#333333] text-white text-xs font-satoshi">
                      {isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleCopyLink}
                        className="text-[#b3b3b3] hover:text-[#f5b210] transition-all duration-300 ease-in-out cursor-pointer"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1A1A1A] border-[#333333] text-white text-xs font-satoshi">
                      Share Link
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Link
                  to="/pricing"
                  className="px-2 py-1 text-sm rounded bg-[#333333] text-[#f5b210] hover:bg-[#f5b210] hover:text-[#1A1A1A] font-satoshi transition-all duration-300 ease-in-out"
                >
                  Switch to Pro
                </Link>
              </div>
            </div>
            {/* Panels */}
            <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
              {/* Left Panel: Tabs */}
              <ResizablePanel defaultSize={50} minSize={30} className="bg-[#1A1A1A] min-w-0 flex flex-col">
                <div className="flex space-x-2 p-0 text-sm justify-evenly border-b border-[#333333] relative">
                  <button
                    className={`flex items-center gap-1 px-4 py-4 rounded relative cursor-pointer ${
                      activeTab === 'description'
                        ? 'text-[#f5b210] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:border-b-2 after:border-solid after:border-[#f5b210]'
                        : 'text-[#ffffff] hover:text-[#f5b210]'
                    } transition-all duration-300 ease-in-out`}
                    onClick={() => setActiveTab('description')}
                    role="tab"
                    aria-selected={activeTab === 'description'}
                    aria-label="View Description"
                  >
                    <Code className={`h-4 w-4 ${activeTab === 'description' ? 'text-[#f5b210]' : ''}`} />
                    Description
                  </button>
                  <button
                    className={`flex items-center gap-1 px-4 py-2 rounded relative cursor-pointer ${
                      activeTab === 'editorial'
                        ? 'text-[#f5b210] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:border-b-2 after:border-solid after:border-[#f5b210]'
                        : 'text-[#ffffff] hover:text-[#f5b210]'
                    } transition-all duration-300 ease-in-out`}
                    onClick={() => setActiveTab('editorial')}
                    role="tab"
                    aria-selected={activeTab === 'editorial'}
                    aria-label="View Editorial"
                  >
                    <BookOpen className={`h-4 w-4 ${activeTab === 'editorial' ? 'text-[#f5b210]' : ''}`} />
                    Editorial
                  </button>
                  <button
                    className={`flex items-center gap-1 px-4 py-2 rounded relative cursor-pointer ${
                      activeTab === 'submissions'
                        ? 'text-[#f5b210] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:border-b-2 after:border-solid after:border-[#f5b210]'
                        : 'text-[#ffffff] hover:text-[#f5b210]'
                    } transition-all duration-300 ease-in-out`}
                    onClick={() => setActiveTab('submissions')}
                    role="tab"
                    aria-selected={activeTab === 'submissions'}
                    aria-label="View Submissions"
                  >
                    <Clock className={`h-4 w-4 ${activeTab === 'submissions' ? 'text-[#f5b210]' : ''}`} />
                    Submissions
                  </button>
                  <button
                    className={`flex items-center gap-1 px-4 py-2 rounded relative cursor-pointer ${
                      activeTab === 'notes'
                        ? 'text-[#f5b210] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:border-b-2 after:border-solid after:border-[#f5b210]'
                        : 'text-[#ffffff] hover:text-[#f5b210]'
                    } transition-all duration-300 ease-in-out`}
                    onClick={() => setActiveTab('notes')}
                    role="tab"
                    aria-selected={activeTab === 'notes'}
                    aria-label="View Notes"
                  >
                    <PenSquare className={`h-4 w-4 ${activeTab === 'notes' ? 'text-[#f5b210]' : ''}`} />
                    Notes
                  </button>
                  <button
                    className={`flex items-center gap-1 px-4 py-2 rounded relative cursor-pointer ${
                      activeTab === 'ai-discussions'
                        ? 'text-[#f5b210] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:border-b-2 after:border-solid after:border-[#f5b210]'
                        : 'text-[#ffffff] hover:text-[#f5b210]'
                    } transition-all duration-300 ease-in-out`}
                    onClick={() => setActiveTab('ai-discussions')}
                    role="tab"
                    aria-selected={activeTab === 'ai-discussions'}
                    aria-label="View AI Discussions"
                  >
                    <IconSparkles className={`h-4 w-4 ${activeTab === 'ai-discussions' ? 'text-[#f5b210]' : ''}`} />
                    AI Discussions
                  </button>
                </div>
                <div
                  className="flex-1 overflow-y-auto scrollbar-none description-container"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {activeTab === 'description' && (
                    <Description
                      problem={problem}
                      isStarred={isStarred}
                      setIsStarred={setIsStarred}
                    />
                  )}
                  {activeTab === 'editorial' && (
                    <Editorial editorial={problem?.editorial} />
                  )}
                  {activeTab === 'submissions' && (
                    <Submissions
                      submissions={submissions}
                      onViewCode={(code) => {
                        setSelectedCode(code);
                        setIsCodeModalOpen(true);
                      }}
                    />
                  )}
                  {activeTab === 'notes' && (
                    isNotesLoading ? (
                      <div className="p-6 text-white font-satoshi bg-[#1A1A1A] h-full">
                        <h2 className="text-base font-semibold mb-4">Notes</h2>
                        <p>Loading notes...</p>
                      </div>
                    ) : (
                      <Notes
                        notes={notes ?? ''}
                        saveNotes={saveNotes}
                        register={register}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        control={control}
                      />
                    )
                  )}
                  {activeTab === 'ai-discussions' && (
                    <AIDiscussions />
                  )}
                </div>
              </ResizablePanel>
              <ResizableHandle className="w-0.5 bg-[#f5b210]/10 hover:bg-[#f5b210] cursor-col-resize transition-colors" />
              {/* Right Panel: Playground */}
              <ResizablePanel defaultSize={50} minSize={30} className="bg-[#212121] relative min-w-0">
                <ResizablePanelGroup
                  direction="vertical"
                  className="h-[calc(100vh-48px)] min-h-0"
                  onLayout={(sizes) => {
                    setPanelSizes(sizes);
                  }}
                >
                  <ResizablePanel
                    defaultSize={panelSizes[0]}
                    minSize={isTestCasesCollapsed ? 90 : 30}
                    maxSize={isTestCasesCollapsed ? 100 : 70}
                    className="w-full overflow-auto px-5 min-h-0"
                  >
                    <CodeEditor
                      problem={problem}
                      language={language}
                      setLanguage={setLanguage}
                      code={code}
                      setCode={setCode}
                      handleCopyCode={handleCopyCode}
                      handleResetCode={handleResetCode}
                      handleFullScreen={handleFullScreen}
                      isFullScreen={isFullScreen}
                      isTestCasesCollapsed={isTestCasesCollapsed}
                      setIsTestCasesCollapsed={setIsTestCasesCollapsed}
                      runCode={runCode}
                      submitCode={submitCode}
                      setShowTestCases={setShowTestCases}
                      setHasRunCode={setHasRunCode}
                      setActiveTestTab={setActiveTestTab}
                      setSuccess={setSuccess}
                      customTestCases={customTestCases}
                      problemId={id}
                      isRunning={isRunning}
                      isSubmitting={isSubmitting}
                    />
                  </ResizablePanel>
                  <ResizableHandle
                    className="h-8 w-0.5 bg-[#f5b210]/10 hover:bg-[#f5b210] transition-colors"
                    style={{ cursor: 'row-resize', pointerEvents: 'auto', zIndex: 10 }}
                    aria-label="Resize Code Editor and Test Cases"
                    disabled={isTestCasesCollapsed}
                  />
                  <ResizablePanel
                    defaultSize={panelSizes[1]}
                    minSize={isTestCasesCollapsed ? 0 : 35}
                    maxSize={isTestCasesCollapsed ? 10 : 65}
                    className="w-full overflow-auto min-h-0"
                  >
                    <div className="flex items-center justify-start gap-8 bg-[#212121] h-8 px-5 border-b border-[#333333]">
                      <button
                        className={`flex items-center gap-1 text-sm font-medium transition-all p-1 cursor-pointer ${
                          activeTestTab === 'test-cases'
                            ? 'text-[#f5b210] border-b-2 border-[#f5b210]'
                            : 'text-[#ffffff] hover:text-[#f5b210]'
                        }`}
                        onClick={() => setActiveTestTab('test-cases')}
                        role="tab"
                        aria-selected={activeTestTab === 'test-cases'}
                        aria-label="View Test Cases"
                      >
                        <CheckCircle className={`h-4 w-4 ${activeTestTab === 'test-cases' ? 'text-[#f5b210]' : 'text-[#ffffff]'}`} />
                        Test Cases
                      </button>
                      <button
                        className={`flex items-center gap-1 text-sm font-medium transition-all p-1 cursor-pointer ${
                          activeTestTab === 'test-results'
                            ? 'text-[#f5b210] border-b-2 border-[#f5b210]'
                            : 'text-[#ffffff] hover:text-[#f5b210]'
                        }`}
                        onClick={() => setActiveTestTab('test-results')}
                        role="tab"
                        aria-selected={activeTestTab === 'test-results'}
                        aria-label="View Test Results"
                      >
                        <IconReport className={`h-4 w-4 ${activeTestTab === 'test-results' ? 'text-[#f5b210]' : 'text-[#ffffff]'}`} />
                        Test Results
                      </button>
                    </div>
                    {activeTestTab === 'test-cases' && (
                      <TestCases
                        problem={problem}
                        activeTestCaseId={activeTestCaseId}
                        setActiveTestCaseId={setActiveTestCaseId}
                        showTestCases={showTestCases}
                        output={output}
                        isTestCasePanelOpen={isTestCasePanelOpen}
                        setIsTestCasePanelOpen={setIsTestCasePanelOpen}
                        customTestCases={customTestCases}
                        addCustomTestCase={addCustomTestCase}
                        deleteCustomTestCase={deleteCustomTestCase}
                        registerTestCase={registerTestCase}
                        handleTestCaseSubmit={handleTestCaseSubmit}
                        testCaseErrors={testCaseErrors}
                        resetTestCase={resetTestCase}
                        activeTestTab={activeTestTab}
                        setActiveTestTab={setActiveTestTab}
                        hasRunCode={hasRunCode}
                      />
                    )}
                    {activeTestTab === 'test-results' && (
                      <div className="w-full px-4 py-3 overflow-auto h-full bg-[#181818]">
                        {!hasRunCode ? (
                          <div className="text-[#E5E7EB] text-sm text-center p-4">
                            You must run your code first.
                          </div>
                        ) : output.length > 0 ? (
                          <div className="space-y-3">
                            {output.map((res, index) => (
                              <div
                                key={index}
                                className="bg-[#1E1E1E] p-3 rounded-lg text-sm text-[#E5E7EB] border border-[#2A2A2A]"
                              >
                                <p className="font-medium">
                                  <span className="text-[#F5B210]">Test Case {index + 1} Output:</span> {res.stdout || 'N/A'}
                                </p>
                                <p className="mt-1">
                                  <span className="text-[#F5B210]">Status:</span>{' '}
                                  <span className={res.passed ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
                                    {res.passed ? 'Passed' : 'Failed'}
                                  </span>
                                </p>
                                {res.stderr && (
                                  <p className="mt-1 text-[#EF4444]">
                                    <span className="text-[#F5B210]">Error:</span> {res.stderr}
                                  </p>
                                )}
                                {res.compileOutput && (
                                  <p className="mt-1 text-[#EF4444]">
                                    <span className="text-[#F5B210]">Compile Error:</span> {res.compileOutput}
                                  </p>
                                )}
                                <p className="mt-1">
                                  <span className="text-[#F5B210]">Runtime:</span> {res.time || 'N/A'}
                                </p>
                                <p className="mt-1">
                                  <span className="text-[#F5B210]">Memory:</span> {res.memory || 'N/A'}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[#E5E7EB] text-sm text-center p-4">
                            No results available. Please run or submit your code.
                          </div>
                        )}
                      </div>
                    )}
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
            </ResizablePanelGroup>
            {/* Code Modal */}
            {isCodeModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#1E1E1E] rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-[#E5E7EB]">Submission Code</h3>
                    <button
                      onClick={() => setIsCodeModalOpen(false)}
                      className="text-[#b3b3b3] hover:text-[#f5b210]"
                      aria-label="Close code modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <pre className="bg-[#212121] p-4 rounded-md text-[#E5E7EB] text-sm overflow-auto">
                    <code>{selectedCode}</code>
                  </pre>
                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={() => setIsCodeModalOpen(false)}
                      className="bg-[#F5B210] hover:bg-[#D4A017] text-[#1E1E1E] px-4 py-2 text-sm font-medium rounded-md"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDetailPage;