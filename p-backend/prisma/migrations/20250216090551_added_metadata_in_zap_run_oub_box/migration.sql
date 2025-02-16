/*
  Warnings:

  - Added the required column `metaData` to the `ZapRunOutBox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ZapRunOutBox" ADD COLUMN     "metaData" JSONB NOT NULL;
