import React, { useEffect, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Copy, RefreshCcw, ChevronUp, ChevronDown, Code, Settings, Play, Send } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { languageMap, getCodeStub } from '@/lib/utils';
import SpaceSettingModal from './SpaceSettingModal';
import { toast } from 'sonner';
import { CheckCircle, XCircle } from 'lucide-react';
import { ConfettiSideCannons } from '@/components/magicui/confetti-side-cannons'; // Import confetti

// Load settings from localStorage with defaults
const loadEditorSettings = () => {
  const saved = localStorage.getItem('editorSettings');
  return saved
    ? JSON.parse(saved)
    : {
        editorTheme: 'vs-dark',
        editorFontSize: 14,
        minimapEnabled: false,
        wordWrap: 'off',
        lineNumbers: 'on',
        tabSize: 2,
      };
};

const PreferenceNav = ({
  language,
  setLanguage,
  handleCopyCode,
  handleResetCode,
  isTestCasesCollapsed,
  setIsTestCasesCollapsed,
  isSettingsOpen,
  setIsSettingsOpen,
}) => (
  <div className="flex items-center justify-between bg-[#212121] h-10 py-6 w-full px-4 border-b border-[#333333]">
    <div className="flex items-center gap-2">
      <h3 className="text-sm font-medium text-[#ffffff]">
        <Code className="h-4 w-4 text-[#f5b210] inline mr-2" />
        Code Editor
      </h3>
    </div>
    <div className="flex items-center gap-3">
      <Select onValueChange={setLanguage} value={language}>
        <SelectTrigger className="hover:bg-[#2A2A2A] text-[#ffffff] cursor-pointer border-none h-8 text-sm font-medium px-2 w-[140px]">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent className="bg-[#2A2A2A] text-[#ffffff] border-none">
          {languageMap.map((lang) => (
            <SelectItem key={lang.name} value={lang.name} className="text-xs">
              <div className="flex items-center">{lang.display}</div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCode}
                className="text-[#b3b3b3] hover:text-[#f5b210] hover:bg-[#2A2A2A] rounded p-1.5 cursor-pointer"
                aria-label="Copy code"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#2A2A2A] text-[#ffffff] border-[#333333] text-xs">
              Copy Code
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetCode}
                className="text-[#b3b3b3] hover:text-[#f5b210] hover:bg-[#2A2A2A] rounded p-1.5 cursor-pointer"
                aria-label="Reset code"
              >
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#2A2A2A] text-[#ffffff] border-[#333333] text-xs">
              Reset Code
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
                className="text-[#b3b3b3] hover:text-[#f5b210] hover:bg-[#2A2A2A] rounded p-1.5 cursor-pointer"
                aria-label="Open editor settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#2A2A2A] text-[#ffffff] border-[#333333] text-xs">
              Editor Settings
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsTestCasesCollapsed(!isTestCasesCollapsed)}
                className="text-[#b3b3b3] hover:text-[#f5b210] hover:bg-[#2A2A2A] rounded p-1.5 cursor-pointer"
                aria-label={isTestCasesCollapsed ? 'Expand Test Cases' : 'Collapse Test Cases'}
              >
                {isTestCasesCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#2A2A2A] text-[#ffffff] border-[#333333] text-xs">
              {isTestCasesCollapsed ? 'Expand Test Cases' : 'Collapse Test Cases'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  </div>
);

const CodeEditor = ({
  problem,
  language,
  setLanguage,
  code,
  setCode,
  handleCopyCode,
  handleResetCode,
  handleFullScreen,
  isFullScreen,
  isTestCasesCollapsed,
  setIsTestCasesCollapsed,
  runCode,
  submitCode,
  setShowTestCases,
  setHasRunCode,
  setActiveTestTab,
  setSuccess,
  customTestCases,
  problemId,
  isRunning,
  isSubmitting,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editorTheme, setEditorTheme] = useState(loadEditorSettings().editorTheme);
  const [editorFontSize, setEditorFontSize] = useState(loadEditorSettings().editorFontSize);
  const [minimapEnabled, setMinimapEnabled] = useState(loadEditorSettings().minimapEnabled);
  const [wordWrap, setWordWrap] = useState(loadEditorSettings().wordWrap);
  const [lineNumbers, setLineNumbers] = useState(loadEditorSettings().lineNumbers);
  const [tabSize, setTabSize] = useState(loadEditorSettings().tabSize);
  const [showConfetti, setShowConfetti] = useState(false); // State for confetti

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      editorTheme,
      editorFontSize,
      minimapEnabled,
      wordWrap,
      lineNumbers,
      tabSize,
    };
    localStorage.setItem('editorSettings', JSON.stringify(settings));
  }, [editorTheme, editorFontSize, minimapEnabled, wordWrap, lineNumbers, tabSize]);

  useEffect(() => {
    if (problem && language) {
      const codeStub = getCodeStub(problem, language);
      setCode(codeStub);
    }
  }, [problem, language, setCode]);

  const monacoLanguage = languageMap.find((l) => l.name.toUpperCase() === language.toUpperCase())?.monaco || 'plaintext';

  const handleRunCode = async () => {
    if (!code) {
      toast.error('Please enter code to run.');
      return;
    }
    try {
      await runCode(problem, code, language, customTestCases);
      setShowTestCases(true);
      setHasRunCode(true);
      setActiveTestTab('test-results');
      toast.success('Code executed!');
    } catch (err) {
      toast.error('Failed to run code: ' + err.message);
    }
  };

  const handleSubmitCode = async () => {
    if (!code) {
      toast.error('Please enter code to submit.');
      return;
    }
    try {
      const response = await submitCode(problem, code, language, problemId);
      setShowTestCases(true);
      setHasRunCode(true);
      setActiveTestTab('test-results');
      if (response.submission.status === 'Accepted') {
        toast.success('Accepted!', { icon: <CheckCircle className="text-[#166534]" /> });
        setSuccess(true);
        setShowConfetti(true); // Trigger confetti
        setTimeout(() => {
          setSuccess(false);
          setShowConfetti(false); // Reset confetti after 3 seconds
        }, 3000);
      } else {
        toast.error('Wrong Answer', { icon: <XCircle className="text-[#ef4444]" /> });
      }
    } catch (err) {
      toast.error('Failed to submit code: ' + err.message);
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      <ConfettiSideCannons trigger={showConfetti} /> {/* Add confetti component */}
      <PreferenceNav
        language={language}
        setLanguage={setLanguage}
        handleCopyCode={handleCopyCode}
        handleResetCode={handleResetCode}
        isTestCasesCollapsed={isTestCasesCollapsed}
        setIsTestCasesCollapsed={setIsTestCasesCollapsed}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
      />
      <div className="flex-1 min-h-0">
        <MonacoEditor
          height="100%"
          language={monacoLanguage}
          theme={editorTheme}
          value={code || ''}
          onChange={setCode}
          options={{
            minimap: { enabled: minimapEnabled },
            fontSize: editorFontSize,
            scrollBeyondLastLine: false,
            lineNumbers: lineNumbers,
            wordWrap: wordWrap,
            tabSize: tabSize,
            lineNumbersMinChars: 3,
            automaticLayout: true,
          }}
          className="border-t border-[#333333]"
        />
      </div>
      <div className="bg-[#212121] h-10 flex items-center justify-end px-5 space-x-3 border-t border-[#333333]">
        <Button
          onClick={handleRunCode}
          disabled={isRunning || isSubmitting}
          className="bg-transparent hover:bg-[#f5b210]/10 text-white text-sm px-3 py-0 cursor-pointer"
          aria-label="Run code"
        >
          <Play className="w-4 h-4 text-[#f5b210] mr-1" />
          {isRunning ? 'Running...' : 'Run'}
        </Button>
        <Button
          onClick={handleSubmitCode}
          disabled={isRunning || isSubmitting}
          className="bg-transparent border border-[#28a056] hover:bg-[#28a056]/10 text-white text-sm px-3 py-0 cursor-pointer"
          aria-label="Submit code"
        >
          <Send className="w-4 h-4 text-[#28a056] mr-1" />
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
      {isSettingsOpen && (
        <SpaceSettingModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          editorTheme={editorTheme}
          setEditorTheme={setEditorTheme}
          editorFontSize={editorFontSize}
          setEditorFontSize={setEditorFontSize}
          minimapEnabled={minimapEnabled}
          setMinimapEnabled={setMinimapEnabled}
          wordWrap={wordWrap}
          setWordWrap={setWordWrap}
          lineNumbers={lineNumbers}
          setLineNumbers={setLineNumbers}
          tabSize={tabSize}
          setTabSize={setTabSize}
        />
      )}
    </div>
  );
};

export default CodeEditor;