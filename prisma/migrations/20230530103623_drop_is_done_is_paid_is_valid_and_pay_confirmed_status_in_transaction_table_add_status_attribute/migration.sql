/*
  Warnings:

  - You are about to drop the column `isDone` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `isPaid` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `isValid` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `payConfirmed` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "isDone",
DROP COLUMN "isPaid",
DROP COLUMN "isValid",
DROP COLUMN "payConfirmed",
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1;
