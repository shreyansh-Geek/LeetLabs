// @/components/Problems/FilterSidebar.jsx
import React from "react";
import { motion } from "framer-motion";
import { Filter, ChevronUp, ChevronDown } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

const FilterSidebar = ({
  difficultyFilter,
  topicFilter,
  companyFilter,
  statusFilter,
  handleDifficultyFilter,
  handleTopicFilter,
  handleCompanyFilter,
  handleStatusFilter,
  clearFilters,
  companies,
  topics,
  difficulties,
  statuses,
  isCompaniesOpen,
  isTopicsOpen,
  isDifficultyOpen,
  isStatusOpen,
  setIsCompaniesOpen,
  setIsTopicsOpen,
  setIsDifficultyOpen,
  setIsStatusOpen,
  setIsCompaniesModalOpen,
  setIsTopicsModalOpen,
  displayedCompanies,
  displayedTopics,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="md:w-1/4"
    >
      <div className="bg-neutral-900/80 backdrop-blur-lg rounded-lg p-4 shadow-lg border border-neutral-800/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Filter size={16} className="text-[#f5b210]" />
            Filters
          </h2>
          <button
            onClick={clearFilters}
            className="text-[#ef4444] text-sm font-medium hover:underline cursor-pointer"
          >
            CLEAR ALL
          </button>
        </div>

        {/* Companies Section */}
        <div className="mb-4">
          <button
            onClick={() => setIsCompaniesOpen(!isCompaniesOpen)}
            className="flex justify-between items-center w-full text-sm font-bold text-gray-300"
          >
            Companies
            {isCompaniesOpen ? (
              <ChevronUp size={16} className="text-gray-300" />
            ) : (
              <ChevronDown size={16} className="text-gray-300" />
            )}
          </button>
          {isCompaniesOpen && (
            <div className="mt-2 space-y-2">
              {displayedCompanies.map((company) => (
                <div key={company.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={`company-${company.name}`}
                    checked={companyFilter.includes(company.name)}
                    onCheckedChange={() => handleCompanyFilter(company.name)}
                    className="border-[#ffffff] data-[state=checked]:bg-[#f5b210] data-[state=checked]:border-[#f5b210]"
                    iconClassName="text-black"
                  />
                  <label
                    htmlFor={`company-${company.name}`}
                    className="text-sm text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {company.name} ({company.count})
                  </label>
                </div>
              ))}
              {companies.length > 6 && (
                <button
                  onClick={() => setIsCompaniesModalOpen(true)}
                  className="text-[#f5b210] text-sm font-medium hover:underline cursor-pointer"
                >
                  Show more
                </button>
              )}
            </div>
          )}
        </div>

        {/* Topics Section */}
        <div className="mb-4">
          <button
            onClick={() => setIsTopicsOpen(!isTopicsOpen)}
            className="flex justify-between items-center w-full text-sm font-bold text-gray-300"
          >
            Topics
            {isTopicsOpen ? (
              <ChevronUp size={16} className="text-gray-300" />
            ) : (
              <ChevronDown size={16} className="text-gray-300" />
            )}
          </button>
          {isTopicsOpen && (
            <div className="mt-2 space-y-2">
              {displayedTopics.map((topic) => (
                <div key={topic.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={`topic-${topic.name}`}
                    checked={topicFilter.includes(topic.name)}
                    onCheckedChange={() => handleTopicFilter(topic.name)}
                    className="border-[#ffffff] data-[state=checked]:bg-[#f5b210] data-[state=checked]:border-[#f5b210]"
                    iconClassName="text-black"
                  />
                  <label
                    htmlFor={`topic-${topic.name}`}
                    className="text-sm text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {topic.name} ({topic.count})
                  </label>
                </div>
              ))}
              {topics.length > 6 && (
                <button
                  onClick={() => setIsTopicsModalOpen(true)}
                  className="text-[#f5b210] text-sm font-medium hover:underline cursor-pointer"
                >
                  Show more
                </button>
              )}
            </div>
          )}
        </div>

        {/* Difficulty Section */}
        <div className="mb-4">
          <button
            onClick={() => setIsDifficultyOpen(!isDifficultyOpen)}
            className="flex justify-between items-center w-full text-sm font-bold text-gray-300"
          >
            Difficulty
            {isDifficultyOpen ? (
              <ChevronUp size={16} className="text-gray-300" />
            ) : (
              <ChevronDown size={16} className="text-gray-300" />
            )}
          </button>
          {isDifficultyOpen && (
            <div className="mt-2 space-y-2">
              {difficulties.map((difficulty) => (
                <div key={difficulty.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={`difficulty-${difficulty.name}`}
                    checked={difficultyFilter.includes(difficulty.name)}
                    onCheckedChange={() => handleDifficultyFilter(difficulty.name)}
                    className="border-[#ffffff] data-[state=checked]:bg-[#f5b210] data-[state=checked]:border-[#f5b210]"
                    iconClassName="text-black"
                  />
                  <label
                    htmlFor={`difficulty-${difficulty.name}`}
                    className="text-sm text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {difficulty.name.charAt(0) + difficulty.name.slice(1).toLowerCase()} (
                    {difficulty.count})
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Section */}
        <div className="mb-4">
          <button
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className="flex justify-between items-center w-full text-sm font-bold text-gray-300"
          >
            Status
            {isStatusOpen ? (
              <ChevronUp size={16} className="text-gray-300" />
            ) : (
              <ChevronDown size={16} className="text-gray-300" />
            )}
          </button>
          {isStatusOpen && (
            <div className="mt-2 space-y-2">
              {statuses.map((status) => (
                <div key={status.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.name}`}
                    checked={statusFilter.includes(status.name)}
                    onCheckedChange={() => handleStatusFilter(status.name)}
                    className="border-[#ffffff] data-[state=checked]:bg-[#f5b210] data-[state=checked]:border-[#f5b210]"
                    iconClassName="text-black"
                  />
                  <label
                    htmlFor={`status-${status.name}`}
                    className="text-sm text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {status.name} ({status.count})
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FilterSidebar;