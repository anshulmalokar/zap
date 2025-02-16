/*
  Warnings:

  - Added the required column `metaData` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metaData` to the `Trigger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "metaData" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Trigger" ADD COLUMN     "metaData" JSONB NOT NULL;
