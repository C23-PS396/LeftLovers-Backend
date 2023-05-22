/*
  Warnings:

  - You are about to drop the `_FoodToTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FoodToTransaction" DROP CONSTRAINT "_FoodToTransaction_A_fkey";

-- DropForeignKey
ALTER TABLE "_FoodToTransaction" DROP CONSTRAINT "_FoodToTransaction_B_fkey";

-- DropTable
DROP TABLE "_FoodToTransaction";

-- CreateTable
CREATE TABLE "FoodTransaction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "foodId" TEXT,
    "transactionId" TEXT,

    CONSTRAINT "FoodTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FoodTransaction" ADD CONSTRAINT "FoodTransaction_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodTransaction" ADD CONSTRAINT "FoodTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
