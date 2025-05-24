-- CreateTable
CREATE TABLE "GlossaryTerm" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlossaryTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RelatedTerms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RelatedTerms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryTerm_term_key" ON "GlossaryTerm"("term");

-- CreateIndex
CREATE INDEX "_RelatedTerms_B_index" ON "_RelatedTerms"("B");

-- AddForeignKey
ALTER TABLE "_RelatedTerms" ADD CONSTRAINT "_RelatedTerms_A_fkey" FOREIGN KEY ("A") REFERENCES "GlossaryTerm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RelatedTerms" ADD CONSTRAINT "_RelatedTerms_B_fkey" FOREIGN KEY ("B") REFERENCES "GlossaryTerm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
