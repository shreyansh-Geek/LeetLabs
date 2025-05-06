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
  
    try {
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
  
      return res.status(200).json({
        success: true,
        message: 'Sheet fetched successfully',
        sheet,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error fetching sheet' });
    }
  };