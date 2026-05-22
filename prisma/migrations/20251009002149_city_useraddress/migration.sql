/*
  Warnings:

  - Added the required column `city` to the `UserAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."UserAddress" ADD COLUMN     "city" TEXT NOT NULL;
