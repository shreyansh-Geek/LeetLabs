import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star, Tag, Lightbulb, MessageSquare, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner'; // Import sonner

const Description = ({ problem, isStarred, setIsStarred }) => {
  const [expandedSections, setExpandedSections] = useState({
    tags: false,
    discussion: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleForumButtonClick = () => {
    toast.info('Public Discussion Forum Coming Soon!', {
      duration: 3000, // Auto-close after 3 seconds
      style: {
        background: '#212121',
        color: '#fff',
        border: '1px solid #333333',
      },
    });
  };

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-[#28a056]/20 text-[#28a056] border-[#28a056]";
      case "medium":
        return "bg-[#f5b210]/20 text-[#f5b210] border-[#f5b210]";
      case "hard":
        return "bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]";
      default:
        return "bg-gray-600/20 text-gray-600 border-gray-600";
    }
  };

  const parseConstraints = (constraints) => {
    if (!constraints) return [];
    return constraints
      .split('\n')
      .filter((line) => line.trim().startsWith('-'))
      .map((line) => line.replace(/^- /, '').trim());
  };

  const parseHints = (hints) => {
    if (!hints || typeof hints !== 'string') return [];
    return hints
      .split('\n')
      .filter((line) => line.trim().match(/^\d+\.\s*/))
      .map((line) => line.replace(/^\d+\.\s*/, '').trim());
  };

  const constraints = parseConstraints(problem?.constraints);
  const hints = parseHints(problem?.hints);

  return (
    <div className="p-6 text-white font-satoshi bg-[#1A1A1A]">
      
      {/* Header Section */}
      <div className="mb-8 border-b border-[#333333] pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{problem?.title || 'No Title'}</h1>
          <button
            type="button"
            className="text-[#f5b210] hover:text-[#f5b210]/80 p-1 cursor-pointer"
            onClick={() => setIsStarred(!isStarred)}
          >
            <Star className={cn('h-4 w-4', isStarred ? 'fill-[#f5b210]' : '')} />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className={cn('px-2 py-0.5 text-xs font-medium rounded', getDifficultyStyle(problem?.difficulty))}>
            {problem?.difficulty || 'Unknown'}
          </span>
          <div className="flex gap-1">
            {problem?.tags?.map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs bg-[#2A2A2A] text-gray-300 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Problem Description */}
      <div className="mb-8">
        <h2 className="text-base font-semibold mb-3">Description</h2>
        <div className="text-sm text-gray-300 leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: ({ inline, className, children, ...props }) => (
                inline ? (
                  <code className="font-mono bg-[#2A2A2A] px-1 rounded text-gray-100" {...props}>
                    {children}
                  </code>
                ) : (
                  <code className="font-mono bg-[#2A2A2A] p-2 rounded block text-gray-100 text-sm" {...props}>
                    {children}
                  </code>
                )
              ),
              h1: ({ children }) => <h1 className="text-xl font-semibold mt-4 mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-semibold mt-4 mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold mt-3 mb-1">{children}</h3>,
              p: ({ children }) => <p className="mb-2 text-sm">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-4 mb-2 text-sm">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 text-sm">{children}</ol>,
              li: ({ children }) => <li className="mb-1 text-sm">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            }}
          >
            {problem?.description || 'No Description'}
          </ReactMarkdown>
        </div>
      </div>

      {/* Examples */}
      <div className="mb-8">
        <h2 className="text-base font-semibold mb-3">Examples</h2>
        {Array.isArray(problem?.testcases) && problem.testcases.length > 0 ? (
          problem.testcases
            .filter((tc) => !tc.isHidden)
            .map((example, index) => (
              <div key={index} className="mb-4 p-3 bg-[#2A2A2A] rounded border border-[#333333]">
                <h3 className="text-sm font-semibold">Example {index + 1}</h3>
                <div className="mt-2 text-sm">
                  <p className="font-mono text-gray-300 bg-[#333333] p-2 rounded">
                    <strong>Input:</strong> {example.input}
                  </p>
                  <p className="font-mono text-gray-300 bg-[#333333] p-2 rounded mt-1">
                    <strong>Output:</strong> {example.output}
                  </p>
                </div>
              </div>
            ))
        ) : (
          <p className="text-gray-400 text-sm">No examples available</p>
        )}
      </div>

      {/* Constraints */}
      <div className="mb-8">
        <h2 className="text-base font-semibold mb-3">Constraints</h2>
        <ul className="list-disc pl-4 text-sm text-gray-300">
          {constraints.length > 0 ? (
            constraints.map((constraint, index) => (
              <li key={index} className="mb-1">
                {constraint.split(/(\d+|\^|<=|>=|=|10\^\d+)/g).map((part, i) =>
                  /\d+|\^|<=|>=|=|10\^\d+/.test(part) ? (
                    <code key={i} className="font-mono text-gray-100">{part}</code>
                  ) : (
                    part
                  )
                )}
              </li>
            ))
          ) : (
            <li>No constraints available</li>
          )}
        </ul>
      </div>

      {/* Expandable Sections */}
      <div className="mb-8">
        <div className="border-t border-[#333333] py-3">
          <button
            className="flex items-center justify-between w-full text-sm text-gray-300 font-semibold hover:text-[#f5b210] transition-colors cursor-pointer"
            onClick={() => toggleSection('tags')}
          >
            <span className="flex items-center">
              <Tag className="h-4 w-4 mr-2 text-[#f5b210]" />
              Tags
            </span>
            {expandedSections.tags ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {expandedSections.tags && (
            <div className="mt-2 flex flex-wrap gap-2">
              {problem?.tags?.map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-[#333333] text-gray-300 rounded">
                  {tag}
                </span>
              )) || <p className="text-gray-400 text-sm">No tags available</p>}
            </div>
          )}
        </div>

        {hints.length > 0 ? (
          hints.map((hint, index) => (
            <div key={`hint-${index + 1}`} className="border-t border-[#333333] py-3">
              <button
                className="flex items-center justify-between w-full text-sm text-gray-300 font-semibold hover:text-[#f5b210] transition-colors cursor-pointer"
                onClick={() => toggleSection(`hint-${index + 1}`)}
              >
                <span className="flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-[#f5b210]" />
                  Hint {index + 1}
                </span>
                {expandedSections[`hint-${index + 1}`] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {expandedSections[`hint-${index + 1}`] && (
                <div className="mt-2 text-sm text-gray-300">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: ({ inline, className, children, ...props }) => (
                        inline ? (
                          <code className="font-mono bg-[#2A2A2A] px-1 rounded text-gray-100" {...props}>
                            {children}
                          </code>
                        ) : (
                          <code className="font-mono bg-[#2A2A2A] p-2 rounded block text-gray-100 text-sm" {...props}>
                            {children}
                          </code>
                        )
                      ),
                      p: ({ children }) => <p className="mb-2 text-sm">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    }}
                  >
                    {hint}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="border-t border-[#333333] py-3">
            <p className="flex items-center text-sm text-gray-300 font-semibold">
              <Lightbulb className="h-4 w-4 mr-2 text-[#f5b210]" />
              Hints
            </p>
            <p className="text-gray-400 text-sm mt-2">No hints available</p>
          </div>
        )}

        <div className="border-t border-[#333333] py-3">
          <button
            className="flex items-center justify-between w-full text-sm text-gray-300 font-semibold hover:text-[#f5b210] transition-colors cursor-pointer"
            onClick={() => toggleSection('discussion')}
          >
            <span className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 text-[#f5b210]" />
              Discussion
            </span>
            {expandedSections.discussion ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {expandedSections.discussion && (
            <div className="mt-3 bg-[#212121] p-4 rounded border border-[#333333]">
              <div className="flex items-center mb-3">
                <Users className="h-4 w-4 mr-2 text-[#3b82f6]" />
                <h3 className="text-sm font-semibold text-white">Community Discussion</h3>
              </div>
              <div className="border-l-2 border-[#3b82f6] pl-3 mb-3">
                <p className="text-gray-300 text-xs italic">
                  “Any tips for optimizing the two-pointer approach for this problem?”
                </p>
                <p className="text-gray-400 text-xs mt-1">— User123, 2 hours ago</p>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Join our community to share solutions, ask questions, and learn from others!
              </p>
              <Button
                className="bg-[#3b82f6] hover:bg-[#3b82f6]/80 text-white text-sm px-3 py-1"
                onClick={handleForumButtonClick}
              >
                Join the Forum
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 py-3 border-t border-[#333333]">
        © 2025 LeetLabs All rights reserved
      </div>
    </div>
  );
};

export default Description;