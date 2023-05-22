/*
  Warnings:

  - You are about to drop the `BankAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FoodToTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_merchantId_fkey";

-- DropForeignKey
ALTER TABLE "_FoodToTransaction" DROP CONSTRAINT "_FoodToTransaction_A_fkey";

-- DropForeignKey
ALTER TABLE "_FoodToTransaction" DROP CONSTRAINT "_FoodToTransaction_B_fkey";

-- DropIndex
DROP INDEX "Merchant_locationId_key";

-- DropTable
DROP TABLE "BankAccount";

-- DropTable
DROP TABLE "Transaction";

-- DropTable
DROP TABLE "_FoodToTransaction";
