-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_sellerId_fkey";

-- DropIndex
DROP INDEX "BankAccount_sellerId_key";

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
