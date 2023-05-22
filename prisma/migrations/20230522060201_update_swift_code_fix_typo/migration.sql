/*
  Warnings:

  - You are about to drop the column `swifctCode` on the `BankAccount` table. All the data in the column will be lost.
  - Added the required column `swiftCode` to the `BankAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankAccount" DROP COLUMN "swifctCode",
ADD COLUMN     "swiftCode" TEXT NOT NULL;
