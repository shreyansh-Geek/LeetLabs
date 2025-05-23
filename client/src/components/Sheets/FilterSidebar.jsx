import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FilterSidebar = ({
  tagFilter,
  handleTagFilter,
  clearFilters,
  tags,
  displayedTags,
  isTagsOpen,
  setIsTagsOpen,
  setIsTagsFilterModalOpen,
}) => {
  return (
    <div className="w-64 bg-neutral-900 p-4 rounded-lg border border-neutral-800/50 satoshi">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-[#f5b210] hover:text-[#f5b210]/80 text-sm"
        >
          Clear All
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-300">Tags</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsTagsOpen(!isTagsOpen)}
              className="text-gray-300 hover:text-[#f5b210]"
            >
              {isTagsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
          {isTagsOpen && (
            <div className="space-y-2">
              {displayedTags.map((tag) => (
                <div key={tag.name} className="flex items-center gap-2">
                  <Checkbox
                    checked={tagFilter.includes(tag.name)}
                    onCheckedChange={() => handleTagFilter(tag.name)}
                    className="border-gray-300 data-[state=checked]:bg-[#f5b210] data-[state=checked]:border-[#f5b210]"
                  />
                  <span className="text-sm text-gray-300">
                    {tag.name} ({tag.count})
                  </span>
                </div>
              ))}
              {tags.length > 6 && (
                <Button
                  variant="link"
                  onClick={() => setIsTagsFilterModalOpen(true)}
                  className="text-[#f5b210] hover:text-[#f5b210]/80 text-sm p-0"
                >
                  View all tags
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;