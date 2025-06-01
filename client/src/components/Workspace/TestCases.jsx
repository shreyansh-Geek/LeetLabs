import React from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TestCases = ({
  problem,
  activeTestCaseId,
  setActiveTestCaseId,
  isTestCasePanelOpen,
  setIsTestCasePanelOpen,
  customTestCases,
  addCustomTestCase,
  deleteCustomTestCase,
  registerTestCase,
  handleTestCaseSubmit,
  testCaseErrors,
}) => {
  // Limit displayed test cases to 3, or fewer if less available
  const displayedTestCases = problem?.testcases?.slice(0, 3) || [];
  // Use displayed count for custom test case indexing
  const problemTestCaseCount = displayedTestCases.length;

  return (
    <div
      className="w-full px-4 py-3 overflow-auto h-full bg-[#181818]"
      role="region"
      aria-label="Test Cases"
    >
      <div
        className="flex mt-2 items-center overflow-x-auto scrollbar-thin scrollbar-thumb-[#F5B210]/20 scrollbar-track-[#2A2A2A]"
        role="tablist"
        aria-label="Test Case Selection"
      >
        {/* Problem Test Case Tabs (Limited to 3) */}
        {displayedTestCases.map((_, index) => (
          <div
            key={index}
            className="mr-2"
            onClick={() => {
              setActiveTestCaseId(index);
              setIsTestCasePanelOpen(false);
            }}
            role="tab"
            aria-selected={activeTestCaseId === index}
            aria-label={`Select Test Case ${index + 1}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setActiveTestCaseId(index);
                setIsTestCasePanelOpen(false);
              }
            }}
          >
            <div className="flex items-center">
              <div
                className={`font-medium transition-all inline-flex bg-[#212121] hover:bg-[#F5B210]/10 border border-[#2A2A2A] rounded-md px-3 py-1 cursor-pointer whitespace-nowrap text-sm relative ${
                  activeTestCaseId === index
                    ? 'text-[#E5E7EB] bg-[#F5B210]/10 border-[#F5B210]/30 '
                    : 'text-[#9CA3AF]'
                }`}
              >
                Case {index + 1}
              </div>
            </div>
          </div>
        ))}
        {/* Custom Test Case Tabs */}
        {customTestCases.map((_, index) => (
          <div
            key={`custom-${index}`}
            className="mr-2 relative group"
            role="tab"
            aria-selected={activeTestCaseId === problemTestCaseCount + index}
            aria-label={`Select Test Case ${problemTestCaseCount + index + 1}`}
            tabIndex={0}
          >
            <div
              className="flex items-center"
              onClick={() => {
                setActiveTestCaseId(problemTestCaseCount + index);
                setIsTestCasePanelOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setActiveTestCaseId(problemTestCaseCount + index);
                  setIsTestCasePanelOpen(false);
                }
              }}
            >
              <div
                className={`font-medium transition-all inline-flex bg-[#212121] hover:bg-[#F5B210]/10 border border-[#2A2A2A] rounded-md px-3 py-1 cursor-pointer whitespace-nowrap text-sm relative ${
                  activeTestCaseId === problemTestCaseCount + index
                    ? 'text-[#E5E7EB] bg-[#F5B210]/10 border-[#F5B210]/30'
                    : 'text-[#9CA3AF]'
                }`}
              >
                Case {problemTestCaseCount + index + 1}
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCustomTestCase(index);
                    }}
                    className="absolute top-0 right-0 text-[#D1D5DB] bg-[#2A2A2A] p-0.5 rounded-full transform translate-x-1/2 translate-y-[-30%] z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 cursor-pointer"
                    aria-label={`Delete Test Case ${problemTestCaseCount + index + 1}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1E1E1E] border-[#2A2A2A] text-[#E5E7EB] text-xs">
                  Delete Test Case {problemTestCaseCount + index + 1}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
        {/* + Icon to Add New Test Case */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsTestCasePanelOpen(!isTestCasePanelOpen);
          }}
          className="ml-2 text-[#F5B210] hover:bg-[#F5B210]/10 px-1.5 py-0.5 rounded-md transition-colors duration-200 cursor-pointer"
          aria-label={isTestCasePanelOpen ? 'Close custom test case form' : 'Add new test case'}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
      {/* Custom Test Case Form */}
      {isTestCasePanelOpen && (
        <form
          onSubmit={handleTestCaseSubmit(addCustomTestCase)}
          className="mt-3 space-y-3 bg-[#1E1E1E] p-3 rounded-lg border border-[#2A2A2A]"
        >
          <div>
            <label htmlFor="test-case-input" className="text-sm font-medium text-[#E5E7EB]">
              Input
            </label>
            <Input
              id="test-case-input"
              {...registerTestCase('input')}
              placeholder="Enter input"
              className="mt-1 bg-[#2A2A2A] text-[#E5E7EB] border-[#F5B210]/20 h-8 text-sm rounded-md focus:border-[#F5B210] focus:ring-1 focus:ring-[#F5B210] transition-colors duration-200"
              aria-label="Test case input"
            />
            {testCaseErrors.input && (
              <p className="text-[#EF4444] text-sm mt-1">{testCaseErrors.input.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="test-case-output" className="text-sm font-medium text-[#E5E7EB]">
              Expected Output
            </label>
            <Input
              id="test-case-output"
              {...registerTestCase('output')}
              placeholder="Enter expected output"
              className="mt-1 bg-[#2A2A2A] text-[#E5E7EB] border-[#F5B210]/20 h-8 text-sm rounded-md focus:border-[#F5B210] focus:ring-1 focus:ring-[#F5B210] transition-colors duration-200"
              aria-label="Test case output"
            />
            {testCaseErrors.output && (
              <p className="text-[#EF4444] text-sm mt-1">{testCaseErrors.output.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="bg-[#F5B210] hover:bg-[#D4A017] text-[#1E1E1E] px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer"
            aria-label="Add test case"
          >
            Add Test Case
          </Button>
        </form>
      )}
      {/* Test Case Details (Input/Output) */}
      {!isTestCasePanelOpen && (
        <div className="my-4 space-y-3">
          <div>
            <p className="text-sm font-medium text-[#E5E7EB]">Input</p>
            <div className="w-full cursor-text rounded-md border px-3 py-2 bg-[#1E1E1E] border-[#2A2A2A] text-[#E5E7EB] mt-1 text-sm">
              {activeTestCaseId < problemTestCaseCount
                ? problem?.testcases[activeTestCaseId]?.input
                : customTestCases[activeTestCaseId - problemTestCaseCount]?.input}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-[#E5E7EB]">Expected Output</p>
            <div className="w-full cursor-text rounded-md border px-3 py-2 bg-[#1E1E1E] border-[#2A2A2A] text-[#E5E7EB] mt-1 text-sm">
              {activeTestCaseId < problemTestCaseCount
                ? problem?.testcases[activeTestCaseId]?.output
                : customTestCases[activeTestCaseId - problemTestCaseCount]?.output}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCases;