import {db} from '../utils/db.js';

export const getAllUserSubmissions = async (req, res) => {
  const userId = req.user.id;
  try {
    console.log('Fetching submissions for userId:', userId); // Debug log
    const submissions = await db.submission.findMany({
      where: { userId },
      include: {
        problem: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Return 200 with submissions (empty array if none)
    return res.status(200).json({
      success: true,
      data: submissions || [], // Ensure empty array if null
    });
  } catch (error) {
    console.error('Error fetching submissions for userId:', userId, error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};


export const getUserSubmissionsForProblem = async (req, res) => {
    const userId = req.user.id;
    const { problemId } = req.params;
    try {
        const submissions = await db.submission.findMany({
            where: {
                userId,
                problemId,
            },
        });

        if (!submissions || !Array.isArray(submissions) || submissions.length === 0) {
            return res.status(404).json({ error: "Submissions not found." });
        }

        return res.status(200).json({
            success: true,
            message: "All the User Submissions for this Problem fetched successfully",
            submissions,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error While Fetching All the User Submissions for this Problem",
        });
    }
};

export const getTotalSubmissionsForProblem = async (req, res) => {
    const { problemId } = req.params;
    try {
        const totalSubmissions = await db.submission.count({
            where: {
                problemId,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Total Submissions for this Problem fetched successfully",
            totalSubmissions,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error While Fetching Total Submissions for this Problem",
        });
    }
};

export const getStreakData = async (req, res) => {
  const userId = req.user.id;
  try {
    console.log('Fetching streak data for userId:', userId); // Debug log
    const submissions = await db.submission.findMany({
      where: { userId },
      select: { createdAt: true }, // Schema uses 'createdAt'
      orderBy: { createdAt: 'desc' },
    });

    if (!submissions || submissions.length === 0) {
      console.log('No submissions found for streak calculation for userId:', userId);
      return res.status(200).json({
        success: true,
        message: 'No submissions found, streak data is zero',
        streak: { current: 0, longest: 0 },
      });
    }

    // Get unique submission dates
    const submissionDates = [...new Set(submissions.map(sub => {
      if (!sub.createdAt) return null;
      return new Date(sub.createdAt).toISOString().split('T')[0];
    }).filter(date => date))].sort((a, b) => new Date(b) - new Date(a));

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    const today = new Date().toISOString().split('T')[0];
    const oneDayInMs = 24 * 60 * 60 * 1000;

    if (submissionDates.length > 0) {
      const mostRecentDate = submissionDates[0];
      const isTodayOrYesterday = new Date(today) - new Date(mostRecentDate) <= oneDayInMs;

      if (isTodayOrYesterday) {
        currentStreak = 1;
        for (let i = 1; i < submissionDates.length; i++) {
          const currentDate = new Date(submissionDates[i - 1]);
          const prevDate = new Date(submissionDates[i]);
          const diffInDays = (currentDate - prevDate) / oneDayInMs;

          if (diffInDays === 1) {
            currentStreak += 1;
            tempStreak += 1;
          } else if (diffInDays > 1) {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
      } else {
        currentStreak = 0;
        for (let i = 1; i < submissionDates.length; i++) {
          const currentDate = new Date(submissionDates[i - 1]);
          const prevDate = new Date(submissionDates[i]);
          const diffInDays = (currentDate - prevDate) / oneDayInMs;

          if (diffInDays === 1) {
            tempStreak += 1;
          } else if (diffInDays > 1) {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Streak data fetched successfully',
      streak: { current: currentStreak, longest: longestStreak },
    });
  } catch (error) {
    console.error('Error in getStreakData:', error.message, error.stack);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch streak data. Please try again later.',
    });
  }
};

export const getPerformanceMetrics = async (req, res) => {
  const userId = req.user.id;
  try {
    console.log('Fetching performance metrics for userId:', userId); // Debug log
    const submissions = await db.submission.findMany({
      where: { userId },
      select: { status: true, time: true }, // Schema uses 'time'
    });

    const totalSubmissions = submissions.length;
    const acceptedSubmissions = submissions.filter(sub => sub.status === 'ACCEPTED').length;
    const successRate = totalSubmissions > 0 ? (acceptedSubmissions / totalSubmissions) * 100 : 0;

    // Calculate average time for accepted submissions
    const validTimes = submissions
      .filter(sub => sub.status === 'ACCEPTED' && sub.time != null && !isNaN(parseFloat(sub.time)))
      .map(sub => parseFloat(sub.time));
    const averageTime = validTimes.length > 0
      ? validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length
      : 0;

    // Calculate ranking and percentile
    const solvedProblemsCount = await db.problemSolved.count({ where: { userId } });
    const allUsers = await db.user.count();

    // Fetch users with their problemSolved count using include
    const users = await db.user.findMany({
      include: {
        problemSolved: {
          select: { id: true },
        },
      },
    });

    const usersWithMoreSolves = users.filter(user => user.problemSolved.length > solvedProblemsCount).length;
    const ranking = usersWithMoreSolves + 1;
    const percentile = allUsers > 0 ? ((allUsers - ranking + 1) / allUsers) * 100 : 0;

    return res.status(200).json({
      success: true,
      message: 'Performance metrics fetched successfully',
      metrics: {
        averageTime: `${Math.floor(averageTime / 60)}:${Math.floor(averageTime % 60).toString().padStart(2, '0')}`,
        successRate: successRate.toFixed(1),
        ranking,
        percentile: percentile.toFixed(1),
      },
    });
  } catch (error) {
    console.error('Error in getPerformanceMetrics:', error.message, error.stack);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch performance metrics. Please try again later.',
    });
  }
};
