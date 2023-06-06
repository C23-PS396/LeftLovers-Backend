-- CreateEnum
CREATE TYPE "Badge" AS ENUM ('SATU', 'DUA', 'TIGA', 'EMPAT');

-- CreateTable
CREATE TABLE "Point" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "loyaltyPoint" INTEGER NOT NULL DEFAULT 0,
    "badge" "Badge" NOT NULL,

    CONSTRAINT "Point_pkey" PRIMARY KEY ("id")
);
