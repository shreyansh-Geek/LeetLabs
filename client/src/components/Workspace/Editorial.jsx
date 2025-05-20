// components/Workspace/Editorial.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Editorial = ({ editorial }) => {
  return (
    <div className="bg-[#1A1A1A] h-full border-t border-[#333333]">
      <div className="p-6 h-[calc(100dvh-40px-48px)]  text-white font-satoshi max-w-3xl mx-auto">
        {editorial ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: ({ inline, className, children, ...props }) =>
                inline ? (
                  <code
                    className="font-mono bg-[#2A2A2A] px-1.5 py-0.5 rounded text-[#f5b210] text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <code
                    className="font-mono bg-[#2A2A2A] p-3 rounded-md block text-[#f5b210] text-sm border border-[#444444] shadow-sm"
                    {...props}
                  >
                    {children}
                  </code>
                ),
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-white my-6 border-b border-[#333333] pb-2">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-white my-5 mb-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-semibold text-gray-100 my-3">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="my-3 text-base text-gray-200 leading-6">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 my-3 text-base text-gray-200 leading-6">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5 my-3 text-base text-gray-200 leading-6">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="mb-1 text-base">{children}</li>,
              strong: ({ children }) => (
                <strong className="font-semibold text-gray-100">{children}</strong>
              ),
            }}
          >
            {editorial}
          </ReactMarkdown>
        ) : (
          <div className="text-gray-400 text-base text-center mt-10">
            No editorial available
          </div>
        )}
      </div>
    </div>
  );
};

export default Editorial;