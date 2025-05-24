import { db } from "../utils/db.js";

export const getAllTerms = async (req, res) => {
  const { search = "" } = req.query;
  try {
    const terms = await db.glossaryTerm.findMany({
      where: search ? { term: { contains: search, mode: "insensitive" } } : {},
      orderBy: { term: "asc" },
      select: {
        id: true,
        term: true,
        category: true,
      },
    });
    return res.status(200).json({ success: true, terms });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching glossary terms" });
  }
};

export const getTermById = async (req, res) => {
  const { id } = req.params;
  try {
    const term = await db.glossaryTerm.findUnique({
      where: { id },
      include: {
        relatedConcepts: {
          select: { id: true, term: true },
        },
      },
    });
    if (!term || !term.details.definition) {
      return res.status(404).json({ error: "Term or definition not found" });
    }
    return res.status(200).json({ success: true, term });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching term details" });
  }
};

// New controller to create a glossary term
export const createTerm = async (req, res) => {
  const { term, details, category, relatedConcepts } = req.body;

  // Validation: Check for required fields
  if (!term || !details || !details.definition) {
    return res.status(400).json({
      error: "Missing required fields: 'term' and 'details.definition' are required",
    });
  }

  try {
    // Create the new glossary term
    const newTerm = await db.glossaryTerm.create({
      data: {
        id: String(Date.now()), // Generate a simple ID (or use a UUID library for better uniqueness)
        term,
        details,
        category: category || null, // Optional field
        relatedConcepts: relatedConcepts
          ? {
              connect: relatedConcepts.map((id) => ({ id })), // Connect related concepts if provided
            }
          : undefined,
      },
      include: {
        relatedConcepts: {
          select: { id: true, term: true },
        },
      },
    });

    return res.status(201).json({
      success: true,
      term: newTerm,
      message: "Glossary term created successfully",
    });
  } catch (error) {
    console.error(error);

    // Handle unique constraint violation (e.g., duplicate term)
    if (error.code === "P2002" && error.meta?.target?.includes("term")) {
      return res.status(409).json({
        error: "A term with this name already exists",
      });
    }

    return res.status(500).json({ error: "Error creating glossary term" });
  }
};