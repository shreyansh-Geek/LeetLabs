import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button.jsx';
import { Badge } from '../ui/badge.jsx';
import { Input } from '../ui/input.jsx';
import { Textarea } from '../ui/textarea.jsx'; // Assuming you have a Textarea component
import { Plus, X, Lock, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const CreateSheetModal = ({ isOpen, onClose, createSheet, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'PRIVATE',
    tags: [],
  });
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
        e.preventDefault();
      const tag = newTag.trim().toLowerCase();
      if (!formData.tags.includes(tag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tag],
        }));
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      toast.error('Sheet name is required');
      return;
    }
    if (!['PUBLIC', 'PRIVATE'].includes(formData.visibility)) {
      toast.error('Invalid visibility');
      return;
    }
    if (!Array.isArray(formData.tags) || formData.tags.length === 0) {
      toast.error('At least one tag is required');
      return;
    }
    try {
      const sheetData = {
        name: trimmedName,
        description: formData.description.trim(),
        visibility: formData.visibility,
        tags: formData.tags,
        problems: [], // Optional, as per updated backend
      };
      console.log('Creating sheet with:', JSON.stringify(sheetData, null, 2));
      await createSheet(sheetData);
      toast.success(`Sheet "${trimmedName}" created!`);
      setFormData({ name: '', description: '', visibility: 'PRIVATE', tags: [] });
      onClose();
    } catch (error) {
      console.error('handleSubmit Error:', error);
      toast.error(error.message || 'Failed to create sheet');
    }
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
              <Plus className="w-5 h-5 text-[#f5b210]" />
              Create New Sheet
            </h3>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-[#f5b210] transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#e0e0e0] block mb-1">
                Sheet Name
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter sheet name"
                className="bg-neutral-800 border-neutral-700 text-[#e0e0e0] focus:ring-[#f5b210] focus:border-[#f5b210] rounded-lg"
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#e0e0e0] block mb-1">
                Description
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter sheet description"
                className="bg-neutral-800 border-neutral-700 text-[#e0e0e0] focus:ring-[#f5b210] focus:border-[#f5b210] rounded-lg resize-y"
                rows={3}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#e0e0e0] block mb-1">
                Visibility
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.visibility === 'PRIVATE' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, visibility: 'PRIVATE' })}
                  className={cn(
                    'flex-1',
                    formData.visibility === 'PRIVATE'
                      ? 'bg-[#f5b210] text-black hover:bg-[#f5b210]/80'
                      : 'bg-neutral-800 border-neutral-700 text-[#e0e0e0] hover:bg-neutral-700'
                  )}
                  disabled={isLoading}
                >
                  <Lock size={16} className="mr-2" />
                  Private
                </Button>
                <Button
                  type="button"
                  variant={formData.visibility === 'PUBLIC' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, visibility: 'PUBLIC' })}
                  className={cn(
                    'flex-1',
                    formData.visibility === 'PUBLIC'
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
                {formData.tags.map((tag) => (
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
                type="button"
                onClick={onClose}
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-[#e0e0e0]"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#f5b210] hover:bg-[#f5b210]/80 text-black"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Sheet'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateSheetModal;