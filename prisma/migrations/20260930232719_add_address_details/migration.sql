-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('HOME', 'OFFICE', 'OTHER');

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "addressType" "AddressType" NOT NULL DEFAULT 'HOME',
ADD COLUMN     "deliveryInstructions" TEXT;

-- CreateIndex
CREATE INDEX "Address_userId_isDefault_idx" ON "Address"("userId", "isDefault");
