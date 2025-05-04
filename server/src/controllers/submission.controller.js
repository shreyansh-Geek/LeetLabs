import {db} from '../utils/db.js';

export const getUserSubmissions = async (req, res) => {
    const userId = req.user.id;
    try {
        const submissions = await db.submission.findMany({
            where: {
                userId,
            },
        });

        if (!submissions || !Array.isArray(submissions) || submissions.length === 0) {
            return res.status(404).json({ error: "Submissions not found." });
        }

        return res.status(200).json({
            success: true,
            message: "All the User Submissions fetched successfully",
            submissions,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error While Fetching All the User Submissions",
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