import React, { useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useProfile } from '@/lib/profile';

const COLORS = {
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

const DifficultyChart = () => {
  const { fetchDifficultyStats, difficultyStats, error } = useProfile();

  useEffect(() => {
    fetchDifficultyStats();
  }, [fetchDifficultyStats]);

  const data = [
    { name: 'Easy', value: difficultyStats.easy || 0, color: COLORS.success },
    { name: 'Medium', value: difficultyStats.medium || 0, color: COLORS.warning },
    { name: 'Hard', value: difficultyStats.hard || 0, color: COLORS.error },
  ];

  const isEmpty = data.every((item) => item.value === 0);

  if (error) {
    return (
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50 text-white">
        <h3 className="text-xl font-bold mb-6">Problems by Difficulty</h3>
        <p>Error loading difficulty stats: {error}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50 text-white">
        <h3 className="text-xl font-bold mb-6">Problems by Difficulty</h3>
        <p>No problems solved yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50">
      <h3 className="text-xl font-bold text-white mb-6">Problems by Difficulty</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-sm text-gray-300">{item.name}: {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DifficultyChart;