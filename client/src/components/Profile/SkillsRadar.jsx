import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { useProfile } from '@/lib/profile';

const KNOWN_COMPANIES = [
  'Google', 'Amazon', 'Microsoft', 'Facebook', 'Apple', 'Atlassian', 'Uber', 'Bloomberg', 'Adobe', 'Cisco', 'Tcs', 'Infosys', 'Goldman Sachs', 'JP Morgan', 'Paypal', 'Zoho', 'VM Ware', 'Oracle'
].map((c) => c.toLowerCase());

const COLORS = {
  primary: '#f5b210',
  gradientStart: '#f5b210',
  gradientEnd: '#eab308',
};

const SkillsRadar = () => {
  const { fetchSkillsData, skillsData, error } = useProfile();

  useEffect(() => {
    fetchSkillsData();
  }, [fetchSkillsData]);

  // Process skills data
  const processedSkillsData = useMemo(() => {
    if (!Array.isArray(skillsData) || !skillsData.length) return [];

    // Aggregate and filter skills
    const skillMap = new Map();
    skillsData.forEach((item) => {
      if (!item.skill || typeof item.level !== 'number' || isNaN(item.level)) return;

      const skill = item.skill.trim();
      const normalizedSkill = skill.toLowerCase();

      // Skip company names
      if (KNOWN_COMPANIES.includes(normalizedSkill)) return;

      // Capitalize skill for display
      const displaySkill = skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase();

      if (skillMap.has(displaySkill)) {
        const existing = skillMap.get(displaySkill);
        skillMap.set(displaySkill, {
          skill: displaySkill,
          level: Math.min(existing.level + item.level, 100),
          problems: existing.problems + (item.problems || 0),
        });
      } else {
        skillMap.set(displaySkill, {
          skill: displaySkill,
          level: Math.min(item.level, 100),
          problems: item.problems || 0,
        });
      }
    });

    // Convert to array and sort
    const result = Array.from(skillMap.values())
      .filter((item) => item.level > 0)
      .sort((a, b) => a.skill.localeCompare(b.skill));

    console.log('Processed Skills Data:', result);
    return result;
  }, [skillsData]);

  // Validate skills data
  const isValidSkillsData = processedSkillsData.length > 0;

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50 shadow-lg text-white"
      >
        <h3 className="text-xl font-semibold mb-4">Skills Analysis</h3>
        <p className="text-red-400 text-sm mb-4">Error loading skills: {error.message || 'Unknown error'}</p>
        <button
          onClick={() => fetchSkillsData()}
          className="px-3 py-1 bg-yellow-500 text-black rounded-md text-sm hover:bg-yellow-600 transition"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  if (!isValidSkillsData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50 shadow-lg text-white"
      >
        <h3 className="text-xl font-semibold mb-4">Skills Analysis</h3>
        <p className="text-gray-400 text-sm">No topic-based skills data available. Solve more problems to see your skills!</p>
      </motion.div>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-neutral-800 border border-neutral-700 p-2 rounded-md text-sm text-white">
          <p className="font-medium">{data.skill}</p>
          <p>Level: {data.level}</p>
          <p>Problems Solved: {data.problems}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50 shadow-lg"
    >
      <h3 className="text-xl font-semibold text-white mb-4">Skills Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={processedSkillsData} outerRadius="80%" margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <defs>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={COLORS.gradientStart} stopOpacity={0.8} />
              <stop offset="100%" stopColor={COLORS.gradientEnd} stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <PolarGrid gridType="polygon" stroke="#4B5563" strokeOpacity={0.5} />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: '#D1D5DB', fontSize: 12, fontWeight: 500 }}
            tickLine={{ stroke: '#D1D5DB' }}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Level"
            dataKey="level"
            stroke={COLORS.primary}
            fill="url(#radarGradient)"
            fillOpacity={0.6}
            strokeWidth={2}
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default SkillsRadar;