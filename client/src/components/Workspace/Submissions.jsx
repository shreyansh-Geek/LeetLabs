import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

const Submissions = ({ submissions, onViewCode }) => {
  // Sort submissions by createdAt (latest first)
  const sortedSubmissions = [...submissions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Calculate runtime average (in ms)
  const getRuntimeAverage = (submission) => {
    try {
      const timeValues = JSON.parse(submission.time || '[]')
        .map((val) => parseFloat(val.replace(/s|\\|"/g, '').trim()) * 1000) // Convert seconds to ms
        .filter((val) => !isNaN(val));

      if (timeValues.length === 0) {
        console.warn(`No valid time data for submission ${submission.id}:`, {
          time: submission.time,
        });
        return 'N/A';
      }

      const avgRuntime = timeValues.reduce((sum, val) => sum + val, 0) / timeValues.length;
      return `${avgRuntime.toFixed(2)}ms`;
    } catch (e) {
      console.warn(`Failed to parse time for submission ${submission.id}:`, e, {
        time: submission.time,
      });
      return 'N/A';
    }
  };

  // Calculate memory average (in MB)
  const getMemoryAverage = (submission) => {
    try {
      const memoryValues = JSON.parse(submission.memory || '[]')
        .map((val) => parseFloat(val.replace(/KB|\\|"/g, '').trim()) / 1000) // Convert KB to MB
        .filter((val) => !isNaN(val));

      if (memoryValues.length === 0) {
        console.warn(`No valid memory data for submission ${submission.id}:`, {
          memory: submission.memory,
        });
        return 'N/A';
      }

      const avgMemory = memoryValues.reduce((sum, val) => sum + val, 0) / memoryValues.length;
      return `${avgMemory.toFixed(2)}MB`;
    } catch (e) {
      console.warn(`Failed to parse memory for submission ${submission.id}:`, e, {
        memory: submission.memory,
      });
      return 'N/A';
    }
  };

  return (
    <div className="w-full h-full overflow-auto bg-[#181818] p-4">
      {sortedSubmissions.length === 0 ? (
        <div className="text-[#E5E7EB] text-sm text-center p-4">
          No submissions available.
        </div>
      ) : (
        <table className="w-full text-[#E5E7EB] text-sm">
          <thead>
            <tr className="border-b border-[#333333]">
              <th className="text-left py-2 px-4 font-medium text-[#F5B210]">Time (IST)</th>
              <th className="text-left py-2 px-4 font-medium text-[#F5B210]">Status</th>
              <th className="text-left py-2 px-4 font-medium text-[#F5B210]">Lang</th>
              <th className="text-left py-2 px-4 font-medium text-[#F5B210]">Runtime</th>
              <th className="text-left py-2 px-4 font-medium text-[#F5B210]">Memory</th>
              <th className="text-center py-2 px-4 font-medium text-[#F5B210]">Code</th>
            </tr>
          </thead>
          <tbody>
            {sortedSubmissions.map((submission) => (
              <tr key={submission.id} className="border-b border-[#2A2A2A] hover:bg-[#212121]">
                <td className="py-2 px-4">
                  {submission.createdAt
                    ? new Date(submission.createdAt).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                        timeZone: 'Asia/Kolkata',
                      })
                    : 'N/A'}
                </td>
                <td className="py-2 px-4">
                  <span
                    className={
                      submission.status === 'Accepted' ? 'text-[#22C55E]' : 'text-[#EF4444]'
                    }
                  >
                    {submission.status === 'Accepted' ? 'Correct' : submission.status || 'Unknown'}
                  </span>
                </td>
                <td className="py-2 px-4">{submission.language?.toLowerCase() || 'N/A'}</td>
                <td className="py-2 px-4">{getRuntimeAverage(submission)}</td>
                <td className="py-2 px-4">{getMemoryAverage(submission)}</td>
                <td className="py-2 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewCode(submission.sourceCode || '')}
                    className="text-[#F5B210] hover:text-[#D4A017] hover:bg-[#2A2A2A]"
                    aria-label="View submission code"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Submissions;