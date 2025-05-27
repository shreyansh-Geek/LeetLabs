import React, { useEffect } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useProfile } from '@/lib/profile';

const COLORS = { primary: '#f5b210' };

const SkillsRadar = () => {
  const { fetchSkillsData, skillsData, error } = useProfile();

  useEffect(() => {
    fetchSkillsData();
  }, [fetchSkillsData]);

  // Validate skillsData structure
  const isValidSkillsData = Array.isArray(skillsData) && skillsData.every((item) => item.skill && typeof item.level === 'number');

  if (error) {
    return (
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50 text-white">
        <h3 className="text-xl font-bold mb-6">Skills Analysis</h3>
        <p>Error loading skills: {error}</p>
      </div>
    );
  }

  if (!isValidSkillsData || skillsData.length === 0) {
    return (
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50 text-white">
        <h3 className="text-xl font-bold mb-6">Skills Analysis</h3>
        <p>No skills data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50">
      <h3 className="text-xl font-bold text-white mb-6">Skills Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={skillsData}>
          <PolarGrid gridType="polygon" stroke="#374151" />
          <PolarAngleAxis dataKey="skill" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Level"
            dataKey="level"
            stroke={COLORS.primary}
            fill={COLORS.primary}
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export  default SkillsRadar;