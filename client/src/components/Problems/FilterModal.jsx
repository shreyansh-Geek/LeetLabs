// client/src/components/ui/FilterModal.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Checkbox } from "../ui/checkbox.jsx";
import { Button } from "../ui/button.jsx";

const FilterModal = ({
  isOpen,
  onClose,
  title,
  items, // Array of { name, count }
  selectedItems, // Array of selected item names
  onSelectItem, // Function to handle item selection
  onApply, // Function to apply filters and close modal
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);

  // Filter items based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, items]);

  // Handle clearing all selections
  const handleClearSelection = () => {
    selectedItems.forEach((item) => {
      onSelectItem(item); // Deselect each selected item
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#1a1a1a]/30 backdrop-blur-xs flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-[#27272a]/80 backdrop-blur-md rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-[#3b3b3b]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-[#e0e0e0]">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-[#f5b210]">
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 p-2 rounded-lg bg-neutral-800 text-gray-300 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#f5b210] w-full"
          />
        </div>

        {/* Items in 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto">
          {filteredItems.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <Checkbox
                id={`${title.toLowerCase()}-${item.name}`}
                checked={selectedItems.includes(item.name)}
                onCheckedChange={() => onSelectItem(item.name)}
                className="border-[#ffffff] data-[state=checked]:bg-[#f5b210] data-[state=checked]:border-[#f5b210]"
                iconClassName="text-black"
              />
              <label
                htmlFor={`${title.toLowerCase()}-${item.name}`}
                className="text-sm text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item.name} ({item.count})
              </label>
            </div>
          ))}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          {selectedItems.length > 0 && (
            <Button
              onClick={handleClearSelection}
              className="bg-[#ef4444] hover:bg-[#ef4444]/80 text-white cursor-pointer"
            >
              Clear Selection
            </Button>
          )}
          <Button
            onClick={onClose}
            className="bg-[#3b3b3b] hover:bg-[#4b4b4b] text-[#e0e0e0] cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onApply}
            className="bg-[#f5b210] hover:bg-[#f5b210]/80 text-black cursor-pointer"
          >
            Apply
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FilterModal;