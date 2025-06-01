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
    const submissions = await db.submission.findMany({
      where: { userId },
      select: { createdAt: true },
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
    const submissionDates = [
      ...new Set(
        submissions
          .map(sub => {
            if (!sub.createdAt) return null;
            return new Date(sub.createdAt).toISOString().split('T')[0];
          })
          .filter(date => date)
      ),
    ].sort((a, b) => new Date(b) - new Date(a)); // Newest to oldest

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    const today = new Date().toISOString().split('T')[0];
    const oneDayInMs = 24 * 60 * 60 * 1000;

    if (submissionDates.length === 1) {
      // Single submission case
      const isTodayOrYesterday = new Date(today) - new Date(submissionDates[0]) <= oneDayInMs;
      currentStreak = isTodayOrYesterday ? 1 : 0;
      longestStreak = 1;
    } else if (submissionDates.length > 1) {
      // Multiple submissions
      const mostRecentDate = submissionDates[0];
      const isTodayOrYesterday = new Date(today) - new Date(mostRecentDate) <= oneDayInMs;

      if (isTodayOrYesterday) {
        currentStreak = 1;
      }

      for (let i = 1; i < submissionDates.length; i++) {
        const currentDate = new Date(submissionDates[i - 1]);
        const prevDate = new Date(submissionDates[i]);
        const diffInDays = (currentDate - prevDate) / oneDayInMs;

        if (diffInDays === 1) {
          tempStreak += 1;
          if (isTodayOrYesterday) {
            currentStreak += 1;
          }
        } else if (diffInDays > 1) {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      // Include the last streak
      longestStreak = Math.max(longestStreak, tempStreak);
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
    // Fetch submissions
    const submissions = await db.submission.findMany({
      where: { userId },
      select: { status: true, time: true },
    });

    // Calculate success rate
    const totalSubmissions = submissions.length;
    const acceptedSubmissions = submissions.filter(sub => sub.status === 'Accepted').length;
    const successRate = totalSubmissions > 0 ? (acceptedSubmissions / totalSubmissions) * 100 : 0;

    // Parse time JSON strings and calculate average time for accepted submissions
    const validTimes = submissions
      .filter(sub => sub.status === 'Accepted' && sub.time != null)
      .map(sub => {
        try {
          const times = JSON.parse(sub.time || '[]');
          return times
            .map(t => parseFloat(t.replace(/s|\\|"/g, '').trim()))
            .filter(t => !isNaN(t));
        } catch (e) {
          console.warn(`Invalid time format for submission: ${sub.id}`, e);
          return [];
        }
      })
      .flat();
    const averageTime = validTimes.length > 0
      ? validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length
      : 0;

    // Calculate solved problems count for the user
    const solvedProblemsCount = await db.problemSolved.count({ where: { userId } });

    // Count users with more solved problems
    const usersWithMoreSolves = await db.user.count({
      where: {
        id: { not: userId },
        problemSolved: {
          some: {}, // Ensure user has at least one solved problem
        },
      },
      // Use raw query or aggregation to filter by count
      // Since Prisma doesn't support having, we use a subquery or separate count
    });

    // To get users with more solves, we need to compare problemSolved counts
    const allUsers = await db.user.findMany({
      select: {
        id: true,
        _count: {
          select: { problemSolved: true },
        },
      },
    });
    const usersWithMoreSolvesCount = allUsers.filter(
      user => user.id !== userId && user._count.problemSolved > solvedProblemsCount
    ).length;

    const ranking = usersWithMoreSolvesCount + 1;
    const totalUsers = await db.user.count();
    const percentile = totalUsers > 0 ? ((totalUsers - ranking + 1) / totalUsers) * 100 : 0;

    return res.status(200).json({
      success: true,
      message: 'Performance metrics fetched successfully',
      metrics: {
        averageTime: `${Math.floor(averageTime / 60)}:${Math.floor(averageTime % 60).toString().padStart(2, '0')}`,
        successRate: Number(successRate.toFixed(1)),
        ranking,
        percentile: Number(percentile.toFixed(1)),
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