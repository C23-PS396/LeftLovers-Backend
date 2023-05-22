/*
  Warnings:

  - Added the required column `isDone` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPaid` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isValid` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payConfirmed` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "isDone" BOOLEAN NOT NULL,
ADD COLUMN     "isPaid" BOOLEAN NOT NULL,
ADD COLUMN     "isValid" BOOLEAN NOT NULL,
ADD COLUMN     "payConfirmed" BOOLEAN NOT NULL;
