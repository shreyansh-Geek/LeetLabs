import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

const COLORS = {
  green: '#10b981',
  blue: '#3b82f6',
  orange: '#f97316',
  purple: '#8b5cf6',
  yellow: '#f5b210',
  red: '#ef4444',
};

const StatCard = ({ title, value, secondaryValue, change, icon, color = 'yellow' }) => {
  // Placeholder for dynamic change calculation
  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return null; // Return null if no previous data
    return Math.round(((current - previous) / previous) * 100);
  };

  const dynamicChange = change !== undefined ? change : null;

  // Format primary value
  const formattedValue = title === 'Success Rate' ? `${value || 0}%` : value || '0';

  // Format secondary value (for streaks)
  const formattedSecondaryValue = secondaryValue !== undefined ? secondaryValue : null;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50 shadow-2xl relative overflow-hidden group"
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-${color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-${color}-500/20`}>
            {React.cloneElement(icon, { className: `h-6 w-6 text-${color}-500` })}
          </div>
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                dynamicChange > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {dynamicChange > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(dynamicChange)}%
            </div>
        </div>
        <div className="mb-1">
          {title === '' ? (
            <div className="space-y-1 flex justify-between">
              <h4 className="text-xl font-bold text-white ">
                   {formattedValue} days
                   <span className='block text-sm font-normal text-gray-300' >Current Streak</span>
                </h4>
              {formattedSecondaryValue !== null && (
                <h4 className="text-xl font-bold text-white ">
                   {formattedSecondaryValue} days
                   <span className='block text-sm font-normal text-gray-300' >Longest Streak</span>
                </h4>
              )}
            </div>
          ) : (
            <h3 className="text-2xl font-bold text-white">
              {formattedValue}
            </h3>
          )}
        </div>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;