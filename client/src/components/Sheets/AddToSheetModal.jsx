import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button.jsx';
import { Badge } from '../ui/badge.jsx';
import { Input } from '../ui/input.jsx';
import { Bookmark, X, Plus, Search, Lock, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { debounce } from 'lodash';

const AddToSheetModal = ({ isOpen, onClose, sheets, problemId, addProblemToSheet, createSheet }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSheets, setFilteredSheets] = useState(sheets);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [newSheet, setNewSheet] = useState({
    name: '',
    visibility: 'PRIVATE',
    tags: [],
  });
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce((query) => {
      const filtered = sheets.filter(
        (sheet) =>
          sheet.name.toLowerCase().includes(query.toLowerCase()) ||
          sheet.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredSheets(filtered);
    }, 300),
    [sheets]
  );

  useEffect(() => {
    setFilteredSheets(sheets);
    debouncedSearch(searchQuery);
  }, [sheets, searchQuery, debouncedSearch]);

  const handleAddToSheet = async (sheetId, sheetName) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await addProblemToSheet(sheetId, problemId);
      toast.success(`Problem added to "${sheetName}" successfully!`);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to add problem to sheet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSheet = async () => {
  if (isLoading) return;
  const trimmedName = newSheet.name.trim();
  if (!trimmedName) {
    toast.error('Sheet name is required');
    return;
  }
  if (!['PUBLIC', 'PRIVATE'].includes(newSheet.visibility)) {
    toast.error('Invalid visibility');
    return;
  }
  if (!Array.isArray(newSheet.tags)) {
    toast.error('Tags must be an array');
    return;
  }
  if (newSheet.tags.length === 0) {
    toast.error('At least one tag is required');
    return;
  }
  if (typeof createSheet !== 'function') {
    toast.error('Sheet creation is not available');
    console.error('createSheet is not a function:', createSheet);
    return;
  }
  setIsLoading(true);
  try {
    const sheetData = {
      name: trimmedName,
      visibility: newSheet.visibility,
      tags: newSheet.tags,
      description: 'Default description', // Non-empty description
      problems: [], // Required by backend
    };
    console.log('Creating sheet with:', JSON.stringify(sheetData, null, 2));
    const response = await createSheet(sheetData);
    const newSheetId = response.sheet.id;
    console.log('Adding problem to sheet:', { newSheetId, problemId });
    await addProblemToSheet(newSheetId, problemId);
    toast.success(`Sheet "${trimmedName}" created and problem added!`);
    setNewSheet({ name: '', visibility: 'PRIVATE', tags: [] });
    setIsCreatingSheet(false);
    onClose();
  } catch (error) {
    console.error('handleCreateSheet Error:', error);
    toast.error(error.message || 'Failed to create sheet');
  } finally {
    setIsLoading(false);
  }
};

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      const tag = newTag.trim().toLowerCase();
      if (!newSheet.tags.includes(tag)) {
        setNewSheet((prev) => ({
          ...prev,
          tags: [...prev.tags, tag],
        }));
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewSheet((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  useEffect(() => {
    if (isOpen) {
      const modal = document.querySelector('.modal-content');
      modal?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 bg-[#1a1a1a]/60 backdrop-blur-md flex items-center justify-center z-50"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="modal-content bg-[#27272a]/90 backdrop-blur-xl rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto border border-[#3b3b3b]/50 shadow-2xl satoshi"
          onClick={(e) => e.stopPropagation()}
          tabIndex={-1}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-[#e0e0e0] flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#f5b210]" />
              {isCreatingSheet ? 'Create New Sheet' : 'Add to Sheet'}
            </h3>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-[#f5b210] transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isCreatingSheet ? (
              <motion.div
                key="create-sheet"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium text-[#e0e0e0] block mb-1">
                    Sheet Name
                  </label>
                  <Input
                    value={newSheet.name}
                    onChange={(e) => setNewSheet({ ...newSheet, name: e.target.value })}
                    placeholder="Enter sheet name"
                    className="bg-neutral-800 border-neutral-700 text-[#e0e0e0] focus:ring-[#f5b210] focus:border-[#f5b210] rounded-lg"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#e0e0e0] block mb-1">
                    Visibility
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant={newSheet.visibility === 'PRIVATE' ? 'default' : 'outline'}
                      onClick={() => setNewSheet({ ...newSheet, visibility: 'PRIVATE' })}
                      className={cn(
                        'flex-1',
                        newSheet.visibility === 'PRIVATE'
                          ? 'bg-[#f5b210] text-black hover:bg-[#f5b210]/80'
                          : 'bg-neutral-800 border-neutral-700 text-[#e0e0e0] hover:bg-neutral-700'
                      )}
                      disabled={isLoading}
                    >
                      <Lock size={16} className="mr-2" />
                      Private
                    </Button>
                    <Button
                      variant={newSheet.visibility === 'PUBLIC' ? 'default' : 'outline'}
                      onClick={() => setNewSheet({ ...newSheet, visibility: 'PUBLIC' })}
                      className={cn(
                        'flex-1',
                        newSheet.visibility === 'PUBLIC'
                          ? 'bg-[#f5b210] text-black hover:bg-[#f5b210]/80'
                          : 'bg-neutral-800 border-neutral-700 text-[#e0e0e0] hover:bg-neutral-700'
                      )}
                      disabled={isLoading}
                    >
                      <Globe size={16} className="mr-2" />
                      Public
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#e0e0e0] block mb-1">
                    Tags
                  </label>
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type tag and press Enter"
                    className="bg-neutral-800 border-neutral-700 text-[#e0e0e0] focus:ring-[#f5b210] focus:border-[#f5b210] rounded-lg"
                    disabled={isLoading}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newSheet.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-[#f5b210]/20 text-[#f5b210] border-[#f5b210]/50 cursor-pointer hover:bg-[#f5b210]/30"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag} <X size={12} className="ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button
                    onClick={() => setIsCreatingSheet(false)}
                    className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-[#e0e0e0]"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleCreateSheet}
                    className="flex-1 bg-[#f5b210] hover:bg-[#f5b210]/80 text-black"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Create & Add Problem'}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="select-sheet"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sheets or tags..."
                    className="pl-10 bg-neutral-800 border-neutral-700 text-[#e0e0e0] focus:ring-[#f5b210] focus:border-[#f5b210] rounded-lg"
                    disabled={isLoading}
                  />
                </div>
                {filteredSheets.length === 0 && searchQuery ? (
                  <div className="text-center py-6">
                    <p className="text-neutral-400 text-sm">No sheets match your search.</p>
                    <Button
                      onClick={() => setIsCreatingSheet(true)}
                      className="mt-4 bg-[#f5b210] hover:bg-[#f5b210]/80 text-black"
                      disabled={isLoading}
                    >
                      <Plus size={16} className="mr-2" />
                      Create New Sheet
                    </Button>
                  </div>
                ) : filteredSheets.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-neutral-400 text-sm">No sheets found. Create a sheet to add problems.</p>
                    <Button
                      onClick={() => setIsCreatingSheet(true)}
                      className="mt-4 bg-[#f5b210] hover:bg-[#f5b210]/80 text-black"
                      disabled={isLoading}
                    >
                      <Plus size={16} className="mr-2" />
                      Create New Sheet
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                    {filteredSheets.map((sheet) => (
                      <motion.div
                        key={sheet.id}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg border border-neutral-700/30 hover:bg-neutral-700/50 transition-colors cursor-pointer"
                        onClick={() => handleAddToSheet(sheet.id, sheet.name)}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#e0e0e0] truncate">{sheet.name}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge
                              className={cn(
                                'text-xs font-medium',
                                sheet.visibility === 'PUBLIC'
                                  ? 'bg-[#28a056]/20 text-[#28a056] border-[#28a056]'
                                  : 'bg-[#f5b210]/20 text-[#f5b210] border-[#f5b210]'
                              )}
                            >
                              {sheet.visibility}
                            </Badge>
                            <span className="text-xs text-neutral-400">
                              {sheet.totalProblems} Problem{sheet.totalProblems !== 1 ? 's' : ''}
                            </span>
                            {sheet.tags?.slice(0, 2).map((tag, index) => (
                              <Badge
                                key={index}
                                className="bg-neutral-800/30 text-[#f5b210] text-xs font-medium rounded-sm"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {sheet.tags?.length > 2 && (
                              <Badge className="bg-neutral-800/30 text-[#f5b210] text-xs font-medium rounded-sm">
                                +{sheet.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          className="bg-[#f5b210] hover:bg-[#f5b210]/80 text-black text-sm py-1 px-3"
                          disabled={isLoading}
                          aria-label={`Add problem to ${sheet.name}`}
                        >
                          Add
                        </Button>
                      </motion.div>
                    ))}
                    <Button
                      onClick={() => setIsCreatingSheet(true)}
                      className="w-full mt-4 bg-neutral-700 hover:bg-neutral-600 text-[#e0e0e0] flex items-center justify-center gap-2"
                      disabled={isLoading}
                    >
                      <Plus size={16} />
                      Create New Sheet
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddToSheetModal;