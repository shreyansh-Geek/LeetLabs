// client/src/components/Workspace/AIDiscussions.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../lib/utils';
import { toast } from 'sonner';
import { Send, Loader2, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import { TypingAnimation } from '@/components/magicui/typing-animation';
import MarkdownTypingAnimation from '@/components/magicui/markdown-typing-animation';

// Custom scrollbar styles
const styles = `
  .custom-scroll::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scroll::-webkit-scrollbar-track {
    background: #1A1A1A;
  }
  .custom-scroll::-webkit-scrollbar-thumb {
    background: #f5b210;
    border-radius: 3px;
  }
  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background: #d4a017;
  }
`;

const AIDiscussions = () => {
  const { id: problemId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [problem, setProblem] = useState(null);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [isCurrentResponseTyping, setIsCurrentResponseTyping] = useState(false);
  const [welcomeText, setWelcomeText] = useState('');
  const messagesEndRef = useRef(null);

  // Update welcome text when user or problem changes
  useEffect(() => {
    if (user && problem && messages.length === 0) {
      setWelcomeText(
        `Hi, ${user.name || 'User'}! I am LeetBot, your AI Assistant.\nHow can I help you today with ${problem.title || 'this problem'}?`
      );
    } else {
      setWelcomeText('');
    }
  }, [user, problem, messages.length]);

  // Fetch user and problem details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, problemRes] = await Promise.all([
          apiFetch('/auth/check', 'GET'),
          apiFetch(`/problems/getProblem/${problemId}`, 'GET'),
        ]);
        setUser(userRes.user || { name: 'User' });
        setProblem(problemRes.problem || { title: 'Problem' });
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to load user or problem details');
        setUser({ name: 'User' });
        setProblem({ title: 'Problem' });
      }
    };
    fetchData();
  }, [problemId]);

  // Fetch chat history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await apiFetch(`/ai-discussions/problem/${problemId}`, 'GET');
        setMessages(response.messages || []);
      } catch (error) {
        toast.error('Failed to load chat history');
      }
    };
    fetchMessages();
  }, [problemId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentResponse, welcomeText]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setIsCurrentResponseTyping(true);
    const userMessage = { role: 'user', content: input, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setCurrentResponse(null);

    try {
      const response = await apiFetch(`/ai-discussions/problem/${problemId}`, 'POST', {
        message: input,
      });
      setCurrentResponse(response.message.content || '');
      setMessages((prev) => [...prev, response.message]);
      // Delay to allow typing animation to complete
      setTimeout(() => setIsCurrentResponseTyping(false), 200 + (response.message.content?.length || 0) * 10);
    } catch (error) {
      toast.error(error.message || 'Failed to send message');
      setMessages((prev) => prev.filter((msg) => msg !== userMessage));
      setIsCurrentResponseTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat
  const handleClearChat = async () => {
    try {
      await apiFetch(`/ai-discussions/problem/${problemId}`, 'DELETE');
      setMessages([]);
      setCurrentResponse(null);
      setIsCurrentResponseTyping(false);
      toast.success('Chat cleared');
    } catch (error) {
      toast.error('Failed to clear chat');
    }
  };

  // Copy message
  const handleCopy = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      toast.success('Copied to clipboard');
    });
  };

  return (
    <div className="bg-gradient-to-b from-[#1A1A1A] to-[#2A2A2A] h-full flex flex-col font-satoshi">
      <style>{styles}</style>

      {/* Header */}
      <div className="p-4 border-b border-[#333333] flex justify-between items-center bg-transparent">
        <h2 className="text-white text-sm font-medium">LeetBot: Your AI Companion</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearChat}
          className="text-gray-400 hover:text-[#f5b210] hover:bg-[#2A2A2A] rounded-lg"
          disabled={messages.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear Chat
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll">
        {/* Welcome Message */}
        {welcomeText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start items-start gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-[#f5b210]/20 flex items-center justify-center text-[#f5b210] text-xs font-bold">
              AI
            </div>
            <div className="max-w-[70%] rounded-2xl p-3 text-sm bg-[#2A2A2A] text-white shadow-md">
              <TypingAnimation duration={20} delay={200} className="text-white text-sm whitespace-pre-wrap">
                {welcomeText}
              </TypingAnimation>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-2 group`}
            >
              {/* Avatar */}
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#f5b210]/20 flex items-center justify-center text-[#f5b210] text-xs font-bold">
                  AI
                </div>
              )}
              {/* Message Bubble */}
              <div
                className={`relative max-w-[70%] rounded-2xl p-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#f5b210] to-[#d4a017] text-[#1A1A1A]'
                    : 'bg-[#2A2A2A] text-white'
                } shadow-md flex flex-col gap-2`}
              >
                {msg.role === 'assistant' ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    {msg.role === 'assistant' && messages[messages.length - 1] === msg && currentResponse && isCurrentResponseTyping ? (
                      <MarkdownTypingAnimation
                        text={currentResponse}
                        duration={10}
                        delay={200}
                        className="text-white text-sm"
                        onComplete={() => setIsCurrentResponseTyping(false)}
                      />
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <div className="relative">
                                <SyntaxHighlighter
                                  style={oneDark}
                                  language={match[1]}
                                  PreTag="div"
                                  className="rounded-md"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                                <button
                                  onClick={() => handleCopy(String(children))}
                                  className="absolute top-2 right-2 text-gray-400 hover:text-[#f5b210]"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <code className="bg-[#1A1A1A] px-1 rounded" {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                ) : (
                  <p>{msg.content}</p>
                )}
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.content)}
                    className="self-end text-gray-400 hover:text-[#f5b210] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                )}
              </div>
              {/* User Avatar */}
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-[#f5b210]/20 flex items-center justify-center text-[#f5b210] text-xs font-bold">
                  U
                </div>
              )}
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start items-start gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-[#f5b210]/20 flex items-center justify-center text-[#f5b210] text-xs font-bold">
                AI
              </div>
              <div className="bg-[#2A2A2A] rounded-2xl p-3 text-sm text-white shadow-md">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-[#f5b210] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#f5b210] rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-[#f5b210] rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-[#333333] bg-transparent flex gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask LeetBot about ${problem?.title || 'this problem'}...`}
          className="flex-1 bg-[#2A2A2A] text-white border-[#333333] focus:ring-[#f5b210] rounded-lg text-sm placeholder-gray-400"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-[#f5b210] hover:bg-[#d4a017] text-[#1A1A1A] disabled:opacity-50 rounded-lg"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default AIDiscussions;