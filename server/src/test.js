import { PrismaClient } from '../src/generated/prisma/index.js';
const prisma = new PrismaClient();

async function test() {
  const tags = await prisma.tag.findMany();
  console.log('Tags:', tags);

  const sheets = await prisma.sheet.findMany({
    where: { visibility: 'PUBLIC' },
    include: { creator: { select: { name: true } } },
  });
  console.log('Public Sheets:', sheets);
}

test().finally(() => prisma.$disconnect());