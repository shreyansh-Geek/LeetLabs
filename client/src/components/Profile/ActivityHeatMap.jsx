// Profile/ActivityHeatMap.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '@/lib/profile';

const ActivityHeatmap = () => {
  const { fetchAllUserSubmissions, allSubmissions, error } = useProfile();
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    fetchAllUserSubmissions();
  }, [fetchAllUserSubmissions]);

  useEffect(() => {
    console.log('All Submissions:', allSubmissions);
    if (allSubmissions.length > 0) {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      const dailySubmissions = {};

      allSubmissions.forEach((sub) => {
        if (!sub.submittedAt || !sub.status) return;
        const date = new Date(sub.submittedAt);
        if (isNaN(date.getTime()) || date < oneYearAgo) return;

        const dateKey = date.toISOString().split('T')[0];
        if (!dailySubmissions[dateKey]) {
          dailySubmissions[dateKey] = { total: 0, accepted: 0 };
        }
        dailySubmissions[dateKey].total += 1;
        if (sub.status.toUpperCase() === 'ACCEPTED') {
          dailySubmissions[dateKey].accepted += 1;
        }
      });

      console.log('Daily Submissions:', dailySubmissions);

      const weeks = 52;
      const days = 7;
      const heatmap = [];
      for (let i = 0; i < weeks * days; i++) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dateKey = date.toISOString().split('T')[0];
        const intensity = dailySubmissions[dateKey]
          ? Math.min(Math.floor(dailySubmissions[dateKey].total / 2) + dailySubmissions[dateKey].accepted, 4)
          : 0;
        heatmap.push({ date, intensity, total: dailySubmissions[dateKey]?.total || 0 });
      }
      setHeatmapData(heatmap.reverse());
    }
  }, [allSubmissions]);

  if (error) {
    return (
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50 text-white">
        <h3 className="text-xl font-bold mb-6">Coding Activity</h3>
        <p>Error loading activity: {error}</p>
      </div>
    );
  }

  if (!heatmapData.length) {
    return (
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50 text-white">
        <h3 className="text-xl font-bold mb-6">Coding Activity</h3>
        <p>No activity data available for the past year.</p>
      </div>
    );
  }

  // Calculate month labels
   // Calculate month labels
  const monthLabels = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const startDate = new Date(today.getTime() - (52 * 7 - 1) * 24 * 60 * 60 * 1000);

  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    if (monthDate < startDate) continue;

    // Find the closest heatmap day to the 1st of the month
    const daysSinceStart = Math.floor((monthDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    const weekIndex = Math.floor(daysSinceStart / 7);

    if (weekIndex >= 0 && weekIndex < 52) {
      monthLabels.push({
        weekIndex,
        label: monthDate.toLocaleString('default', { month: 'short' }),
      });
    }
  }

  // Day labels (Sun, Mon, etc.)
  const dayLabels = ['Sun', '', 'Tue', '', 'Thu', '', 'Sat'];

  if (error) {
    return (
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50 text-white">
        <h3 className="text-xl font-bold mb-6">Coding Activity</h3>
        <p className="text-red-400">Error loading activity: {error.message || 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50">
      <h3 className="text-xl font-bold text-white mb-6 flex flex-col ">Coding Activity</h3>
      <div className="relative w-[100%] h-[280px]">
        {/* Month Labels Container */}
        <div className="relative mb-2 ml-0" style={{ display: 'grid', gridTemplateColumns: 'repeat(52, 1fr)', gap: '4px', }}>
          {monthLabels.map(({ weekIndex, label }) => (
            <div
              key={label}
              className="text-xs text-gray-400 text-center"
              style={{ gridColumn: weekIndex + 1, gridRow: 1 }}
            >
              {label}
            </div>
          ))}
        </div>
        {/* Heatmap Grid */}
        <div className="grid grid-cols-52 gap-1 mb-4">
          {heatmapData.map((day, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.5 }}
              className={`w-3.5 h-3.5 rounded-md ${
                day.intensity === 0
                  ? 'bg-neutral-700'
                  : day.intensity === 1
                  ? 'bg-yellow-500/20'
                  : day.intensity === 2
                  ? 'bg-yellow-500/40'
                  : day.intensity === 3
                  ? 'bg-yellow-500/60'
                  : 'bg-yellow-500'
              }`}
              title={`${day.total} submissions on ${day.date.toLocaleDateString()}`}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${
                level === 0
                  ? 'bg-neutral-700'
                  : level === 1
                  ? 'bg-yellow-500/20'
                  : level === 2
                  ? 'bg-yellow-500/40'
                  : level === 3
                  ? 'bg-yellow-500/60'
                  : 'bg-yellow-500'
              }`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default ActivityHeatmap;