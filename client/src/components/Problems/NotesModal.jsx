// @/components/Problems/NotesModal.jsx
import React from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { Button } from "../ui/button.jsx";

const NotesModal = ({
  isOpen,
  onClose,
  currentNote,
  setCurrentNote,
  saveNote,
  clearNote,
}) => {
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
        className="bg-[#27272a]/80 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#3b3b3b]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-[#e0e0e0] mb-4 flex items-center gap-2">
          <Pencil className="w-5 h-5 text-[#f5b210]" />
          Add/Edit Note
        </h3>
        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Write your note here..."
          className="w-full h-48 p-4 rounded-lg bg-[#3b3b3b]/50 text-[#e0e0e0] border border-[#3b3b3b] focus:outline-none focus:ring-2 focus:ring-[#f5b210] resize-none"
        />
        <div className="flex justify-end gap-3 mt-4">
          {currentNote && (
            <Button
              onClick={clearNote}
              className="bg-[#ef4444] hover:bg-[#ef4444]/80 text-white cursor-pointer"
            >
              Clear Note
            </Button>
          )}
          <Button
            onClick={onClose}
            className="bg-[#3b3b3b] hover:bg-[#4b4b4b] text-[#e0e0e0] cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={saveNote}
            className="bg-[#f5b210] hover:bg-[#f5b210]/80 text-black cursor-pointer"
          >
            Save
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotesModal;