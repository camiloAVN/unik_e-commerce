-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('admin', 'user');

-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "slug" SET NOT NULL,
ALTER COLUMN "slug" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'user',
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
