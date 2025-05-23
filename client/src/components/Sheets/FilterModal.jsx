import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

const FilterModal = ({ isOpen, onClose, title, items, selectedItems, onSelectItem, onApply }) => {
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
          <h3 className="text-xl font-semibold text-[#e0e0e0]">{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-300 hover:text-[#f5b210]"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <Checkbox
                checked={selectedItems.includes(item.name)}
                onCheckedChange={() => onSelectItem(item.name)}
                className="border-gray-300 data-[state=checked]:bg-[#f5b210] data-[state=checked]:border-[#f5b210]"
              />
              <span className="text-sm text-gray-300">
                {item.name} ({item.count})
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6 gap-2">
          <Button
            onClick={onApply}
            className="bg-[#f5b210] hover:bg-[#f5b210]/80 text-black"
          >
            Apply
          </Button>
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

export default FilterModal;