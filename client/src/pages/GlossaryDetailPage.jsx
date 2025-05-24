import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { toast } from 'sonner';
import { apiFetch } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import Navbar from '../components/landing/Navbar';

const GlossaryDetailPage = () => {
  const { termId } = useParams();
  const [term, setTerm] = useState(null);

  useEffect(() => {
    console.log('termId from useParams:', termId); // Debug log to verify termId
    const fetchTerm = async () => {
      if (!termId) {
        toast.error('Term ID is undefined');
        return;
      }
      try {
        const data = await apiFetch(`/glossary/${termId}`);
        console.log('Fetched term data:', data); // Debug log to verify response
        setTerm(data.term); // Access the term property from the response
      } catch (error) {
        toast.error('Failed to load term details');
      }
    };
    fetchTerm();
  }, [termId]);

  if (!term) return <div className="min-h-screen bg-white text-black satoshi">Loading...</div>;

  const { definition, example, whyItMatters, commonPitfalls } = term.details || {};

  return (
    <div className="min-h-screen bg-white text-black satoshi">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            asChild
            className="text-gray-700 border border-gray-200 hover:border-[#f5b210] hover:text-[#f5b210] transition-all duration-300 ease-in-out px-5 py-2 rounded-lg text-base font-medium bg-white shadow-sm hover:shadow-md"
          >
            <Link to="/glossary">← Back to Glossary</Link>
          </Button>
        </motion.div>

        {/* Main Term Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm"
        >
          {/* Term Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 arp-display leading-tight">
            {term.term}
          </h1>

          {/* Category Badge */}
          {term.category && (
            <div className="mb-6">
              <Badge className="bg-[#f5b210]/10 text-[#f5b210] font-medium text-sm py-1 px-3 rounded-full border border-[#f5b210]/20 hover:bg-[#f5b210]/20 transition-colors">
                {term.category}
              </Badge>
            </div>
          )}

          {/* Definition Section */}
          {definition && (
            <section className="mb-8 pb-6 border-b border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 satoshi">Definition</h2>
              <div className="prose prose-sm max-w-none text-gray-700 satoshi leading-relaxed">
                <ReactMarkdown>{definition}</ReactMarkdown>
              </div>
            </section>
          )}

          {/* Example Section */}
          {example && (
            <section className="mb-8 pb-6 border-b border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 satoshi">Example / Use Case</h2>
              <div className="prose prose-sm max-w-none text-gray-700 satoshi leading-relaxed">
                <ReactMarkdown>{example}</ReactMarkdown>
              </div>
            </section>
          )}

          {/* Why It Matters Section */}
          {whyItMatters && (
            <section className="mb-8 pb-6 border-b border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 satoshi">Why It Matters</h2>
              <div className="prose prose-sm max-w-none text-gray-700 satoshi leading-relaxed">
                <ReactMarkdown>{whyItMatters}</ReactMarkdown>
              </div>
            </section>
          )}

          {/* Common Pitfalls Section */}
          {commonPitfalls && (
            <section className="mb-8 pb-6 border-b border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 satoshi">Common Pitfalls</h2>
              <div className="prose prose-sm max-w-none text-gray-700 satoshi leading-relaxed">
                <ReactMarkdown>{commonPitfalls}</ReactMarkdown>
              </div>
            </section>
          )}

          {/* Related Terms Section */}
          {term.relatedConcepts && term.relatedConcepts.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 satoshi">Related Terms</h2>
              <ScrollArea className="w-full">
                <div className="flex flex-wrap gap-2">
                  {term.relatedConcepts.map((related) => (
                    <Badge
                      key={related.id}
                      asChild
                      className="bg-gray-50 text-gray-700 font-medium text-sm py-1 px-3 rounded-full border border-gray-200 hover:bg-[#f5b210]/10 hover:text-[#f5b210] hover:border-[#f5b210]/20 transition-colors"
                    >
                      <Link to={`/glossary/${related.id}`}>{related.term}</Link>
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </section>
          )}

          {/* AI Explanation Button */}
          <Button
            className="flex items-center gap-2 text-gray-700 border border-gray-200 hover:border-[#f5b210] hover:text-white hover:bg-[#f5b210] transition-all duration-300 ease-in-out px-5 py-2 rounded-lg text-base font-medium bg-white shadow-sm hover:shadow-md group"
            onClick={() => toast.info('AI Explanation coming soon!')}
          >
            <Bot className="w-5 h-5 group-hover:animate-pulse" />
            Get AI Explanation
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default GlossaryDetailPage;