-- AlterTable
ALTER TABLE "public"."AppSettings" ADD COLUMN     "quoteFontFamily" TEXT NOT NULL DEFAULT 'Helvetica',
ADD COLUMN     "quoteFontSize" INTEGER NOT NULL DEFAULT 9,
ADD COLUMN     "quoteHeaderColor" TEXT NOT NULL DEFAULT '#D61C1C',
ADD COLUMN     "quoteIssuerAddress" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "quoteIssuerEmail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "quoteIssuerName" TEXT NOT NULL DEFAULT 'UNIK S.A.S.',
ADD COLUMN     "quoteIssuerNit" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "quoteIssuerPhone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "quoteIssuerWebsite" TEXT NOT NULL DEFAULT '';
