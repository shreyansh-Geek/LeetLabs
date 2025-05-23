import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

const NotesModal = ({ isOpen, onClose, currentNote, setCurrentNote, saveNote, clearNote }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#1a1a1a]/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-[#27272a]/80 backdrop-blur-md rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto border border-[#3b3b3b]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-[#e0e0e0]">Sheet Notes</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-300 hover:text-[#f5b210]"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <Textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Add your notes here..."
          className="bg-neutral-800 text-gray-300 border border-neutral-700 focus:ring-[#f5b210] focus:border-[#f5b210] rounded-lg min-h-[150px]"
        />
        <div className="flex justify-end gap-2 mt-6">
          <Button
            onClick={saveNote}
            className="bg-[#f5b210] hover:bg-[#f5b210]/80 text-black"
          >
            Save
          </Button>
          {currentNote && (
            <Button
              onClick={clearNote}
              className="bg-neutral-800 hover:bg-neutral-700 text-gray-300 border border-neutral-700"
            >
              Clear
            </Button>
          )}
          <Button
            onClick={onClose}
            className="bg-neutral-800 hover:bg-neutral-700 text-gray-300 border border-neutral-700"
          >
            Cancel
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotesModal;