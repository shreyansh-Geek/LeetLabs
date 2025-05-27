import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { useProfile } from '@/lib/profile';

const COLORS = { success: '#10b981', primary: '#f5b210' };

const ProgressChart = () => {
  const { fetchAllUserSubmissions, allSubmissions, error } = useProfile();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchAllUserSubmissions();
  }, [fetchAllUserSubmissions]);

  useEffect(() => {
    if (allSubmissions.length > 0) {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); // Normalize to start of UTC day
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const dailyData = {};

      for (let i = 0; i < 30; i++) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dateKey = date.toISOString().split('T')[0]; // e.g., '2025-05-04'
        dailyData[dateKey] = { 
          day: 30 - i, 
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // e.g., 'May 4'
          solved: 0, 
          attempted: 0 
        };
      }

      allSubmissions.forEach((sub) => {
        if (!sub.submittedAt || !sub.status) return; // Skip invalid submissions
        const date = new Date(sub.submittedAt);
        if (isNaN(date.getTime()) || date < thirtyDaysAgo) return; // Skip invalid or old dates
        const dateKey = date.toISOString().split('T')[0];
        if (dailyData[dateKey]) {
          dailyData[dateKey].attempted += 1;
          // Normalize status to handle case differences
          if (sub.status.toUpperCase() === 'ACCEPTED') {
            dailyData[dateKey].solved += 1;
          }
        }
      });

      const data = Object.values(dailyData).sort((a, b) => a.day - b.day);
      setChartData(data);
    }
  }, [allSubmissions]);

  if (error) {
    return (
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50 text-white">
        <h3 className="text-xl font-bold mb-6">30-Day Progress</h3>
        <p>Error loading progress: {error}</p>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50 text-white">
        <h3 className="text-xl font-bold mb-6">30-Day Progress</h3>
        <p>No progress data available for the past 30 days.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50">
      <h3 className="text-xl font-bold text-white mb-6">30-Day Progress</h3>
      <ResponsiveContainer width="100%" height={450}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="solvedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="attemptedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#9CA3AF', fontSize: 12 }} 
            interval={1} // Show every 5th date for readability
          />
          <YAxis 
            tick={{ fill: '#9CA3AF' }} 
            allowDecimals={false} // Whole numbers only
            domain={[4, 'auto']} // Start Y-axis at 0
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value, name) => [value, name === 'solved' ? 'Solved' : 'Attempted']}
          />
          <Area
            type="monotone"
            dataKey="attempted"
            stroke={COLORS.primary}
            fillOpacity={1}
            fill="url(#attemptedGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="solved"
            stroke={COLORS.success}
            fillOpacity={1}
            fill="url(#solvedGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;