import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { useProfile } from '@/lib/profile';

const SubmissionsHistory = () => {
  const { fetchAllUserSubmissions, allSubmissions } = useProfile();
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'submittedAt', direction: 'desc' });
  const [averages, setAverages] = useState({ runtime: '0.00ms', memory: '0.00MB' });

  useEffect(() => {
    fetchAllUserSubmissions();
  }, [fetchAllUserSubmissions]);

  useEffect(() => {
    if (allSubmissions?.length > 0) {
      let totalRuntimeSum = 0;
      let totalRuntimeCount = 0;
      let totalMemorySum = 0;
      let totalMemoryCount = 0;

      const history = allSubmissions
        .map((sub) => {

          // Parse runtime array
          let runtimeValues = [];
          try {
            runtimeValues = JSON.parse(sub.runtime || '[]').map((val) =>
              parseFloat(val.replace(/s|\\|"/g, '').trim()) * 1000 // Convert seconds to ms
            );
          } catch (e) {
            console.warn(`Failed to parse runtime for submission ${sub.id}:`, e);
          }
          const avgRuntime =
            runtimeValues.length > 0
              ? runtimeValues.reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0) / runtimeValues.length
              : 0;

          // Parse memory array
          let memoryValues = [];
          try {
            memoryValues = JSON.parse(sub.memory || '[]').map((val) =>
              parseFloat(val.replace(/KB|\\|"/g, '').trim()) / 1000 // Convert KB to MB
            );
          } catch (e) {
            console.warn(`Failed to parse memory for submission ${sub.id}:`, e);
          }
          const avgMemory =
            memoryValues.length > 0
              ? memoryValues.reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0) / memoryValues.length
              : 0;

          // Update totals for overall averages
          if (runtimeValues.length > 0) {
            totalRuntimeSum += avgRuntime;
            totalRuntimeCount++;
          }
          if (memoryValues.length > 0) {
            totalMemorySum += avgMemory;
            totalMemoryCount++;
          }

          return {
            id: sub.id,
            problemTitle: sub.problemTitle || 'Unknown Problem',
            status: (sub.status || 'UNKNOWN').toString().trim(),
            language: sub.language || 'Unknown',
            runtime: `${avgRuntime.toFixed(2)}ms`,
            memory: `${avgMemory.toFixed(2)}MB`,
            submittedAt: sub.submittedAt ? new Date(sub.submittedAt) : new Date(),
          };
        })
        .sort((a, b) => {
          if (sortConfig.key === 'submittedAt') {
            return sortConfig.direction === 'asc'
              ? a.submittedAt - b.submittedAt
              : b.submittedAt - a.submittedAt;
          }
          return 0;
        });

      // Set overall averages
      setAverages({
        runtime: totalRuntimeCount > 0 ? `${(totalRuntimeSum / totalRuntimeCount).toFixed(2)}ms` : '0.00ms',
        memory: totalMemoryCount > 0 ? `${(totalMemorySum / totalMemoryCount).toFixed(2)}MB` : '0.00MB',
      });

      setSubmissionHistory(history);
    } else {
      setSubmissionHistory([]);
      setAverages({ runtime: '0.00ms', memory: '0.00MB' });
    }
  }, [allSubmissions, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getStatusStyles = (status) => {
    // Normalize status: replace spaces with underscores and convert to uppercase
    const normalizedStatus = status?.toString().replace(/\s+/g, '_').toUpperCase().trim();
    switch (normalizedStatus) {
      case 'ACCEPTED':
        return {
          bg: 'bg-green-500/20',
          text: 'text-green-400',
          icon: <CheckCircle className="h-4 w-4 text-green-400" />,
        };
      case 'WRONG_ANSWER':
        return {
          bg: 'bg-red-500/20',
          text: 'text-red-400',
          icon: <XCircle className="h-4 w-4 text-red-400" />,
        };
      case 'TIME_LIMIT_EXCEEDED':
      case 'MEMORY_LIMIT_EXCEEDED':
      case 'RUNTIME_ERROR':
      case 'COMPILATION_ERROR':
        return {
          bg: 'bg-yellow-500/20',
          text: 'text-yellow-400',
          icon: <AlertCircle className="h-4 w-4 text-yellow-400" />,
        };
      default:
        console.warn(`Unknown status: ${status} (normalized: ${normalizedStatus})`); // Debug: Log unexpected statuses
        return {
          bg: 'bg-gray-500/20',
          text: 'text-gray-400',
          icon: <AlertCircle className="h-4 w-4 text-gray-400" />,
        };
    }
  };

  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50 col-span-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Submission History</h3>
        <Link to="/submissions" className="text-[#f5b210] hover:text-yellow-400 text-sm font-medium flex items-center gap-1">
          View All Submissions <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      {submissionHistory.length === 0 ? (
        <div className="text-gray-400 text-center py-8">No submissions yet. Start solving problems!</div>
      ) : (
        <div className="overflow-x-auto">
          <div className="mb-4 text-gray-200 text-sm">
            <span className="font-medium">Average Runtime: </span>{averages.runtime} |{' '}
            <span className="font-medium">Average Memory: </span>{averages.memory}
          </div>
          <table className="w-full text-left text-sm text-gray-200">
            <thead>
              <tr className="border-b border-neutral-700/50">
                <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('submittedAt')}>
                  Date {sortConfig.key === 'submittedAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-4">Problem</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Runtime</th>
                <th className="py-3 px-4">Memory</th>
              </tr>
            </thead>
            <tbody>
              {submissionHistory.map((sub, index) => {
                const { bg, text, icon } = getStatusStyles(sub.status);
                return (
                  <motion.tr
                    key={sub.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-neutral-700/20 hover:bg-neutral-800/50"
                  >
                    <td className="py-3 px-4">{sub.submittedAt.toLocaleDateString()}</td>
                    <td className="py-3 px-4">{sub.problemTitle}</td>
                    <td className="py-3 px-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${bg} ${text}`}>
                        {icon}
                        <span className="font-medium">
                          {sub.status
                            .toLowerCase()
                            .replace('_', ' ')
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{sub.language}</td>
                    <td className="py-3 px-4">{sub.runtime}</td>
                    <td className="py-3 px-4">{sub.memory}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubmissionsHistory;