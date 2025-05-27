import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { useProfile } from '@/lib/profile';

const RecentActivity = () => {
  const { fetchAllUserSubmissions, allSubmissions, error } = useProfile();
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchAllUserSubmissions();
  }, [fetchAllUserSubmissions]);

  useEffect(() => {
    if (allSubmissions.length > 0) {
      const sortedSubmissions = allSubmissions
        .filter((sub) => sub.id && sub.submittedAt && sub.problemTitle && sub.status && sub.language)
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        .slice(0, 6)
        .map((sub) => ({
          id: sub.id,
          action: `${sub.status === 'ACCEPTED' ? 'Solved' : 'Attempted'} "${sub.problemTitle}"`,
          status: sub.status,
          date: new Date(sub.submittedAt),
          language: sub.language,
        }))
        .filter((activity) => !isNaN(activity.date.getTime()));
      setRecentActivity(sortedSubmissions);
    }
  }, [allSubmissions]);

  if (error) {
    return (
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50 text-white">
        <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
        <p>Error loading activity: {error}</p>
      </div>
    );
  }

  if (!recentActivity.length) {
    return (
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50 text-white">
        <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
        <p>No recent activity available.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
        <Link to="/problems" className="text-yellow-500 hover:text-yellow-400 text-sm font-medium flex items-center gap-1">
          View All <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="space-y-4">
        {recentActivity.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-all duration-300"
          >
            <div
              className={`p-2 rounded-lg ${
                activity.status === 'ACCEPTED'
                  ? 'bg-green-500/20'
                  : activity.status === 'WRONG_ANSWER'
                  ? 'bg-red-500/20'
                  : 'bg-yellow-500/20'
              }`}
            >
              {activity.status === 'ACCEPTED' ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : activity.status === 'WRONG_ANSWER' ? (
                <XCircle className="h-4 w-4 text-red-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-400" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{activity.action}</p>
              <p className="text-gray-400 text-xs">
                {activity.date.toLocaleDateString()} • {activity.language}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;