-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "u1" INTEGER NOT NULL,
    "u2" INTEGER NOT NULL,
    "u3" INTEGER NOT NULL,
    "u4" INTEGER NOT NULL,
    "u5" INTEGER NOT NULL,
    "u6" INTEGER NOT NULL,
    "u7" INTEGER NOT NULL,
    "u8" INTEGER NOT NULL,
    "u9" INTEGER NOT NULL,
    "u10" INTEGER NOT NULL,
    "u11" INTEGER NOT NULL,
    "u12" INTEGER NOT NULL,
    "u13" INTEGER NOT NULL,
    "u14" INTEGER NOT NULL,
    "u15" INTEGER NOT NULL,
    "u16" INTEGER NOT NULL,
    "u17" INTEGER NOT NULL,
    "u18" INTEGER NOT NULL,
    "u19" INTEGER NOT NULL,
    "u20" INTEGER NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_customerId_key" ON "UserProfile"("customerId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
