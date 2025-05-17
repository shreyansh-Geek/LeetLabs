import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import Editor from "@monaco-editor/react";
import { supportedLanguages } from "../../sampleProblemData";
import remarkGfm from "remark-gfm";

const PreviewModal = ({ showPreview, setShowPreview, form }) => {
  if (!showPreview) return null;

  const formData = form.getValues(); // Get current form data
  const { title, description, difficulty, tags, constraints, hints, editorial, testCases, languages } = formData;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-[#1a1a1a]/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={() => setShowPreview(false)}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-[#27272a]/80 backdrop-blur-md rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#3b3b3b]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-semibold text-[#e0e0e0] mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-[#eab308]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Problem Preview
        </h3>

        <div className="space-y-6">
          {/* Title and Difficulty */}
          <div>
            <h4 className="text-xl font-bold text-[#e0e0e0]">{title || "Untitled Problem"}</h4>
            <p className="text-[#eab308] mt-1">{difficulty || "No Difficulty Selected"}</p>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-[#3b3b3b] text-[#e0e0e0] px-2 py-1 rounded-md text-sm"
                >
                  {tag || "Unnamed Tag"}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="bg-[#3b3b3b]/50 p-4 rounded-lg border border-[#3b3b3b]">
            <h5 className="text-lg font-semibold text-[#e0e0e0] mb-2">Description</h5>
            <div className="prose prose-invert text-[#e0e0e0] max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {description || "No description provided."}
              </ReactMarkdown>
            </div>
          </div>

          {/* Constraints */}
          {constraints && (
            <div className="bg-[#3b3b3b]/50 p-4 rounded-lg border border-[#3b3b3b]">
              <h5 className="text-lg font-semibold text-[#e0e0e0] mb-2">Constraints</h5>
              <div className="prose prose-invert text-[#e0e0e0] max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {constraints}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Test Cases */}
          {testCases && testCases.length > 0 && (
            <div className="bg-[#3b3b3b]/50 p-4 rounded-lg border border-[#3b3b3b]">
              <h5 className="text-lg font-semibold text-[#e0e0e0] mb-2">Test Cases</h5>
              <div className="space-y-4">
                {testCases.map((tc, index) => (
                  <div key={tc.id} className="border-l-4 border-[#eab308] pl-4">
                    <p className="text-[#e0e0e0] font-medium">Test Case #{index + 1} {tc.isHidden && "(Hidden)"}</p>
                    <p className="text-[#e0e0e0]"><strong>Input:</strong> {tc.input || "No input"}</p>
                    <p className="text-[#e0e0e0]"><strong>Output:</strong> {tc.output || "No output"}</p>
                    {tc.explanation && (
                      <p className="text-[#e0e0e0]"><strong>Explanation:</strong> {tc.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Language-Specific Details */}
          {languages && languages.length > 0 && (
            <div className="bg-[#3b3b3b]/50 p-4 rounded-lg border border-[#3b3b3b]">
              <h5 className="text-lg font-semibold text-[#e0e0e0] mb-2">Language-Specific Details</h5>
              <Tabs defaultValue={languages[0].language} className="w-full">
                <TabsList className="flex flex-wrap gap-2 bg-[#3b3b3b] p-2 rounded-lg">
                  {languages.map((lang) => {
                    const langInfo = supportedLanguages.find((l) => l.id === lang.language);
                    return (
                      <TabsTrigger
                        key={lang.language}
                        value={lang.language}
                        className="px-4 py-2 rounded-sm text-[#e0e0e0] data-[state=active]:text-[#1a1a1a] data-[state=active]:bg-[#eab308] hover:bg-[#eab308]/20 transition-colors font-medium"
                      >
                        {langInfo?.name || lang.language}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                {languages.map((lang) => {
                  const langInfo = supportedLanguages.find((l) => l.id === lang.language);
                  return (
                    <TabsContent key={lang.language} value={lang.language} className="mt-4">
                      {/* Example */}
                      <div className="mb-4">
                        <h6 className="text-md font-semibold text-[#e0e0e0] mb-2">Example</h6>
                        <p className="text-[#e0e0e0]"><strong>Input:</strong> {lang.example.input || "No input"}</p>
                        <p className="text-[#e0e0e0]"><strong>Output:</strong> {lang.example.output || "No output"}</p>
                        {lang.example.explanation && (
                          <div className="prose prose-invert text-[#e0e0e0] max-w-none mt-2">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {lang.example.explanation}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                      {/* Code Snippet */}
                      <div className="mb-4">
                        <h6 className="text-md font-semibold text-[#e0e0e0] mb-2">Code Snippet</h6>
                        <Editor
                          height="200px"
                          language={langInfo?.monaco || "text"}
                          theme="vs-dark"
                          value={lang.codeSnippet || "// No code provided"}
                          options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: "on",
                            roundedSelection: false,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                          }}
                        />
                      </div>
                      {/* Reference Solution */}
                      <div>
                        <h6 className="text-md font-semibold text-[#e0e0e0] mb-2">Reference Solution</h6>
                        <Editor
                          height="200px"
                          language={langInfo?.monaco || "text"}
                          theme="vs-dark"
                          value={lang.referenceSolution || "// No solution provided"}
                          options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: "on",
                            roundedSelection: false,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                          }}
                        />
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>
          )}

          {/* Hints */}
          {hints && (
            <div className="bg-[#3b3b3b]/50 p-4 rounded-lg border border-[#3b3b3b]">
              <h5 className="text-lg font-semibold text-[#e0e0e0] mb-2">Hints</h5>
              <div className="prose prose-invert text-[#e0e0e0] max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {hints}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Editorial */}
          {editorial && (
            <div className="bg-[#3b3b3b]/50 p-4 rounded-lg border border-[#3b3b3b]">
              <h5 className="text-lg font-semibold text-[#e0e0e0] mb-2">Editorial</h5>
              <div className="prose prose-invert text-[#e0e0e0] max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {editorial}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            className="bg-[#eab308] text-[#1a1a1a] hover:bg-[#facc15] shadow-md hover:shadow-lg transition-shadow px-4 py-2"
            onClick={() => setShowPreview(false)}
          >
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PreviewModal;