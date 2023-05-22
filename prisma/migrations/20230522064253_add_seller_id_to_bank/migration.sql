/*
  Warnings:

  - You are about to drop the `BankAccount` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sellerId` to the `Bank` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_sellerId_fkey";

-- AlterTable
ALTER TABLE "Bank" ADD COLUMN     "sellerId" TEXT NOT NULL;

-- DropTable
DROP TABLE "BankAccount";

-- AddForeignKey
ALTER TABLE "Bank" ADD CONSTRAINT "Bank_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;
