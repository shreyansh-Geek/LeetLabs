import { db } from '../utils/db.js';

export const createSheet = async (req, res) => {
  const { name, description, visibility, tags, problems } = req.body;
  const userId = req.user.id;

  try {
    // Validate input
    if (!name || !visibility || !Array.isArray(tags) || !Array.isArray(problems)) {
      return res.status(400).json({ error: 'Name, visibility, tags, and problems are required' });
    }

    if (!['PUBLIC', 'PRIVATE'].includes(visibility)) {
      return res.status(400).json({ error: 'Visibility must be PUBLIC or PRIVATE' });
    }

    // Normalize tags (lowercase, trim)
    const normalizedTags = tags.map(tag => tag.toLowerCase().trim()).filter(tag => tag.length > 0);

    if (normalizedTags.length === 0) {
      return res.status(400).json({ error: 'At least one valid tag is required' });
    }

    // Validate problem IDs
    if (problems.length > 0) {
      const problemExists = await db.problem.findMany({
        where: { id: { in: problems } },
        select: { id: true },
      });
      if (problemExists.length !== problems.length) {
        return res.status(400).json({ error: 'One or more problem IDs are invalid' });
      }
    }

    // Add tags to Tag model
    for (const tag of normalizedTags) {
      await db.tag.upsert({
        where: { name: tag },
        update: {},
        create: { name: tag },
      });
    }

    // Create sheet
    const sheet = await db.sheet.create({
      data: {
        name,
        description,
        visibility,
        creatorId: userId,
        tags: normalizedTags,
        problems,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Sheet created successfully',
      sheet,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error creating sheet' });
  }
};

export const getSheet = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { page = 1, limit = 20 } = req.query; // Pagination parameters
  const skip = (Number(page) - 1) * Number(limit);

  try {
    // Fetch sheet with creator
    const sheet = await db.sheet.findUnique({
      where: { id },
      include: { creator: { select: { name: true } } },
    });

    if (!sheet) {
      return res.status(404).json({ error: 'Sheet not found' });
    }

    if (sheet.visibility === 'PRIVATE' && sheet.creatorId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to view this sheet' });
    }

    // Paginate problems
    const totalProblems = sheet.problems.length;
    const paginatedProblemIds = sheet.problems.slice(skip, skip + Number(limit));

    const problems = paginatedProblemIds.length > 0
      ? await db.problem.findMany({
          where: { id: { in: paginatedProblemIds } },
          select: {
            id: true,
            title: true,
            difficulty: true,
            tags: true,
            description: true,
          },
          orderBy: { id: 'asc' }, // Maintain order of problems
        })
      : [];

    // Calculate progress for entire sheet
    const solvedProblems = sheet.problems.length > 0
      ? await db.problemSolved.count({
          where: {
            userId,
            problemId: { in: sheet.problems },
          },
        })
      : 0;

    return res.status(200).json({
      success: true,
      message: 'Sheet fetched successfully',
      sheet: {
        ...sheet,
        problems, // Paginated problems
        problemsPagination: {
          total: totalProblems,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(totalProblems / Number(limit)),
        },
        progress: {
          solved: solvedProblems,
          total: totalProblems,
          percentage: totalProblems > 0 ? (solvedProblems / totalProblems) * 100 : 0,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error fetching sheet' });
  }
};

  export const updateSheet = async (req, res) => {
    const { id } = req.params;
    const { name, description, visibility, tags, problems } = req.body;
    const userId = req.user.id;
  
    try {
      // Fetch existing sheet
      const sheet = await db.sheet.findUnique({
        where: { id },
      });
  
      if (!sheet) {
        return res.status(404).json({ error: 'Sheet not found' });
      }
  
      // Check if user is the creator
      if (sheet.creatorId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to update this sheet' });
      }
  
      // Validate input (only update provided fields)
      const updateData = {};
  
      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description; // Allow null
      if (visibility) {
        if (!['PUBLIC', 'PRIVATE'].includes(visibility)) {
          return res.status(400).json({ error: 'Visibility must be PUBLIC or PRIVATE' });
        }
        // Prevent cloned sheets from being public
        if (sheet.isCloned && visibility === 'PUBLIC') {
          return res.status(400).json({ error: 'Cloned sheets cannot be made public' });
        }
        updateData.visibility = visibility;
      }
      if (tags) {
        if (!Array.isArray(tags)) {
          return res.status(400).json({ error: 'Tags must be an array' });
        }
        const normalizedTags = tags.map(tag => tag.toLowerCase().trim()).filter(tag => tag.length > 0);
        if (normalizedTags.length === 0) {
          return res.status(400).json({ error: 'At least one valid tag is required' });
        }
        updateData.tags = normalizedTags;
  
        // Add tags to Tag model
        for (const tag of normalizedTags) {
          await db.tag.upsert({
            where: { name: tag },
            update: {},
            create: { name: tag },
          });
        }
      }
      if (problems) {
        if (!Array.isArray(problems)) {
          return res.status(400).json({ error: 'Problems must be an array' });
        }
        if (problems.length > 0) {
          const problemExists = await db.problem.findMany({
            where: { id: { in: problems } },
            select: { id: true },
          });
          if (problemExists.length !== problems.length) {
            return res.status(400).json({ error: 'One or more problem IDs are invalid' });
          }
        }
        updateData.problems = problems;
      }
  
      // Update sheet
      const updatedSheet = await db.sheet.update({
        where: { id },
        data: updateData,
      });
  
      return res.status(200).json({
        success: true,
        message: 'Sheet updated successfully',
        sheet: updatedSheet,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error updating sheet' });
    }
  };

  export const deleteSheet = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
  
    try {
      const sheet = await db.sheet.findUnique({
        where: { id },
      });
  
      if (!sheet) {
        return res.status(404).json({ error: 'Sheet not found' });
      }
  
      if (sheet.creatorId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to delete this sheet' });
      }
  
      await db.sheet.delete({
        where: { id },
      });
  
      return res.status(200).json({
        success: true,
        message: 'Sheet deleted successfully',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error deleting sheet' });
    }
  };

  export const getUserSheets = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const sheets = await db.sheet.findMany({
        where: { creatorId: userId },
        include: { creator: { select: { name: true } } },
      });
  
      return res.status(200).json({
        success: true,
        message: 'User sheets fetched successfully',
        sheets,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error fetching user sheets' });
    }
  };
  
  export const getPublicSheets = async (req, res) => {
    const { search, page = 1, limit = 15 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
  
    try {
      // Build where clause for public sheets
      const where = {
        visibility: 'PUBLIC',
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { tags: { hasSome: [search] } },
          ],
        }),
      };
  
      // Fetch featured sheet IDs
      const featuredSheets = await db.featuredSheet.findMany({
        where: { isRecommended: true },
        select: { sheetId: true },
      });
      const featuredSheetIds = new Set(featuredSheets.map(fs => fs.sheetId));
  
      // Fetch public sheets
      const sheets = await db.sheet.findMany({
        where,
        include: {
          creator: { select: { name: true } },
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }, // Default sorting
      });
  
      // Transform and sort sheets: prioritize featured sheets
      const transformedSheets = sheets
        .map(sheet => ({
          ...sheet,
          isRecommended: featuredSheetIds.has(sheet.id), // Add isRecommended
        }))
        .sort((a, b) => {
          // Prioritize isRecommended: true
          if (a.isRecommended && !b.isRecommended) return -1;
          if (!a.isRecommended && b.isRecommended) return 1;
          // Maintain createdAt order for equal isRecommended
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
  
      // Get total count for pagination
      const total = await db.sheet.count({ where });
  
      return res.status(200).json({
        success: true,
        message: 'Public sheets fetched successfully',
        sheets: transformedSheets,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error fetching public sheets' });
    }
  };
  export const cloneSheet = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
  
    try {
      const sheet = await db.sheet.findUnique({
        where: { id },
        include: { creator: { select: { name: true } } }, // Include creator for reference
      });
  
      if (!sheet) {
        return res.status(404).json({ error: 'Sheet not found' });
      }
  
      if (sheet.visibility !== 'PUBLIC') {
        return res.status(403).json({ error: 'Only public sheets can be cloned' });
      }
  
      const clonedSheet = await db.sheet.create({
        data: {
          name: `Clone of ${sheet.name}`,
          description: sheet.description,
          visibility: 'PRIVATE',
          creatorId: userId,
          tags: sheet.tags,
          problems: sheet.problems,
          isCloned: true,
          clonedFromId: id,
        },
        include: { creator: { select: { name: true } } }, // Include creator in response
      });
  
      return res.status(201).json({
        success: true,
        message: 'Sheet cloned successfully',
        sheet: clonedSheet,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error cloning sheet' });
    }
  };

  export const pinSheet = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { isRecommended } = req.body;
  
    try {
      const sheet = await db.sheet.findUnique({ where: { id } });
      if (!sheet) {
        return res.status(404).json({ error: 'Sheet not found' });
      }
      if (sheet.visibility !== 'PUBLIC') {
        return res.status(400).json({ error: 'Only public sheets can be pinned' });
      }
  
      const featuredSheet = await db.featuredSheet.upsert({
        where: { sheetId: id },
        update: { isRecommended: isRecommended ?? false },
        create: {
          sheetId: id,
          pinnedByAdmin: userId,
          isRecommended: isRecommended ?? false,
        },
      });
  
      return res.status(200).json({
        success: true,
        message: 'Sheet pinned successfully',
        featuredSheet,
        sheet,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error pinning sheet' });
    }
  };

  export const unpinSheet = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
  
    try {
      // Verify sheet exists and is public
      const sheet = await db.sheet.findUnique({ where: { id } });
      if (!sheet) {
        return res.status(404).json({ error: 'Sheet not found' });
      }
      if (sheet.visibility !== 'PUBLIC') {
        return res.status(400).json({ error: 'Only public sheets can be unpinned' });
      }
  
      // Check admin role (assumes checkAdmin middleware)
      const featuredSheet = await db.featuredSheet.findUnique({ where: { sheetId: id } });
      if (!featuredSheet) {
        return res.status(404).json({ error: 'Sheet is not featured' });
      }
  
      // Delete FeaturedSheet record
      await db.featuredSheet.delete({ where: { sheetId: id } });
  
      return res.status(200).json({
        success: true,
        message: 'Sheet unpinned successfully',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error unpinning sheet' });
    }
  };