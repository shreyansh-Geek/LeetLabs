import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  // Seed Tags
  const tags = ['dp', 'graph', 'medium', 'amazon', 'tcs'];
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag },
      update: {},
      create: { name: tag },
    });
  }

  // Seed Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: 'hashed_password', // Replace with actual hashed password
      role: 'ADMIN',
      isemailVerified: true,
    },
  });

  // Seed Coder User
  const coder = await prisma.user.upsert({
    where: { email: 'coder@example.com' },
    update: {},
    create: {
      email: 'coder@example.com',
      name: 'Coder User',
      password: 'hashed_password', // Replace with actual hashed password
      role: 'CODER',
      isemailVerified: true,
    },
  });

  // Seed Problem
  const problem = await prisma.problem.upsert({
    where: { id: 'problem1' },
    update: {},
    create: {
      id: 'problem1',
      title: 'Two Sum',
      description: 'Given an array of integers, return indices of two numbers that add up to a target.',
      difficulty: 'EASY',
      tags: ['array', 'hashmap'],
      userId: admin.id,
      examples: { input: '[2,7,11,15], 9', output: '[0,1]' },
      constraints: '2 <= nums.length <= 10^4',
      editorial: 'Use a hashmap for O(n) solution.',
      testcases: [{ input: '[2,7,11,15], 9', output: '[0,1]' }],
      codeSnippets: {},
      referenceSolutions: {},
    },
  });

  // Seed Public Sheet
  await prisma.sheet.upsert({
    where: { id: 'sheet1' },
    update: {},
    create: {
      id: 'sheet1',
      name: 'FAANG Prep',
      description: 'Curated problems for FAANG interviews',
      visibility: 'PUBLIC',
      creatorId: admin.id,
      tags: ['amazon', 'medium', 'array'],
      problems: [problem.id],
    },
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });