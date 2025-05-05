-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "Sheet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "creatorId" TEXT NOT NULL,
    "tags" TEXT[],
    "problems" TEXT[],
    "isCloned" BOOLEAN NOT NULL DEFAULT false,
    "clonedFromId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedSheet" (
    "id" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "pinnedByAdmin" TEXT NOT NULL,
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeaturedSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Sheet_visibility_tags_idx" ON "Sheet"("visibility", "tags");

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedSheet_sheetId_key" ON "FeaturedSheet"("sheetId");

-- CreateIndex
CREATE INDEX "FeaturedSheet_sheetId_idx" ON "FeaturedSheet"("sheetId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_clonedFromId_fkey" FOREIGN KEY ("clonedFromId") REFERENCES "Sheet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedSheet" ADD CONSTRAINT "FeaturedSheet_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedSheet" ADD CONSTRAINT "FeaturedSheet_pinnedByAdmin_fkey" FOREIGN KEY ("pinnedByAdmin") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
