import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { apiFetch } from '../lib/utils';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import Navbar from '../components/landing/Navbar';

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const GlossaryPage = () => {
  const [terms, setTerms] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const debouncedSearch = useDebounce(search, 300);
  const letterRefs = useRef({});

  const fetchTerms = useCallback(async () => {
    try {
      const query = new URLSearchParams({ search: debouncedSearch }).toString();
      const data = await apiFetch(`/glossary?${query}`);
      console.log('Fetched terms:', data.terms); // Debug log to verify term IDs
      setTerms(data.terms || []); // Ensure terms is always an array
    } catch (error) {
      toast.error('Failed to load glossary terms');
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchTerms();
  }, [fetchTerms]);

  // Group terms by first letter
  const groupedTerms = terms.reduce((acc, term) => {
    const firstLetter = term.term[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(term);
    return acc;
  }, {});

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const visibleLetters = Object.keys(groupedTerms).sort();

  // Group letters into rows of 3 for the terms display
  const letterGroups = [];
  for (let i = 0; i < visibleLetters.length; i += 3) {
    letterGroups.push(visibleLetters.slice(i, i + 3));
  }

  const scrollToLetter = (letter) => {
    setSelectedLetter(letter);
    letterRefs.current[letter]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-black satoshi">
      <Navbar />
      {/* Section with Yellow Background (Title, Search, Alphabet Navigation) */}
      <div className="bg-[#f5b210]/90">
        <div className="max-w-4xl mx-auto px-4 py-12 pt-24 mt-10">
          {/* Page Title and Illustration */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center items-center gap-3 mb-1">
              <h1 className="text-3xl md:text-4xl font-bold text-black arp-display leading-snug">
                LeetLabs Developer Glossary
              </h1>
              <Bot className="w-8 h-8 text-[#f5b210]" />
            </div>
            <p className="text-lg font-medium text-gray-500 max-w-2xl mx-auto">
              Decode complex programming terms with clear, concise definitions — one concept at a time.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="max-w-3xl mx-auto mb-8 flex"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Input
              placeholder="Search coding terms…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-3xl h-16 bg-white border-gray-300 text-gray-600 rounded-md shadow-sm focus:ring-[#f5b210] focus:border-[#f5b210] text-lg py-3 flex justify-center"
            />
          </motion.div>

          {/* Alphabet Navigation */}
          <div className="mb-12">
            {/* Desktop View */}
            <div className="hidden md:flex flex-wrap justify-center gap-2 mb-6">
              {letters.map((letter) => (
                <Button
                  key={letter}
                  variant="ghost"
                  onClick={() => scrollToLetter(letter)}
                  className={`text-lg font-semibold text-gray-600 ${
                    groupedTerms[letter]
                      ? selectedLetter === letter
                        ? 'text-[#f5b210] border-b-2 border-[#f5b210]'
                        : 'hover:text-[#f5b210]'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                  disabled={!groupedTerms[letter]}
                >
                  {letter}
                </Button>
              ))}
            </div>

            {/* Mobile View - Dropdown */}
            <div className="md:hidden mb-6">
              <Select onValueChange={scrollToLetter}>
                <SelectTrigger className="w-full bg-white border-gray-300 text-gray-600 rounded-md shadow-sm">
                  <SelectValue placeholder="Select a letter" />
                </SelectTrigger>
                <SelectContent>
                  {letters.map((letter) => (
                    <SelectItem
                      key={letter}
                      value={letter}
                      disabled={!groupedTerms[letter]}
                      className={groupedTerms[letter] ? 'text-gray-600' : 'text-gray-300'}
                    >
                      {letter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Section with White Background */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {letterGroups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="grid grid-cols-1 sm:grid-cols-3 gap-20 mb-15"
            >
              {group.map((letter) => (
                <motion.div
                  key={letter}
                  ref={(el) => (letterRefs.current[letter] = el)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl font-bold text-gray-800 mb-4 arp-display ">{letter}</h2>
                  <div className='w-full h-1 bg-gray-600 mb-8'></div>
                  <div className="flex flex-col gap-2">
                    {groupedTerms[letter].map((term) => (
                      <Link
                        key={term.id}
                        to={`/glossary/${term.id}`}
                        className="text-gray-600 hover:text-[#f5b210] transition-colors text-sm font-semibold p-2 break-words"
                      >
                        {term.term}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlossaryPage;