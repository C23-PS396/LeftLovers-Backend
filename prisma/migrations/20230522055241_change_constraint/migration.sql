/*
  Warnings:

  - A unique constraint covering the columns `[sellerId]` on the table `BankAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_sellerId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_sellerId_key" ON "BankAccount"("sellerId");

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;
