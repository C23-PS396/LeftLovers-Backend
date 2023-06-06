/*
  Warnings:

  - A unique constraint covering the columns `[customerId]` on the table `Point` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerId` to the `Point` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Point" ADD COLUMN     "customerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Point_customerId_key" ON "Point"("customerId");

-- AddForeignKey
ALTER TABLE "Point" ADD CONSTRAINT "Point_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
