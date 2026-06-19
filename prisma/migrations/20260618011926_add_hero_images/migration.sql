-- CreateTable
CREATE TABLE "public"."HeroImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HeroImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HeroImage_isActive_sortOrder_idx" ON "public"."HeroImage"("isActive", "sortOrder");
