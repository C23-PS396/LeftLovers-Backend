/*
  Warnings:

  - Added the required column `foodName` to the `FoodTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodPrice` to the `FoodTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FoodTransaction" ADD COLUMN     "foodName" TEXT NOT NULL,
ADD COLUMN     "foodPrice" INTEGER NOT NULL;
