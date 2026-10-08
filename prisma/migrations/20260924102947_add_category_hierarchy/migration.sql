/*
  Warnings:

  - You are about to drop the column `firstName` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Commission` table. All the data in the column will be lost.
  - You are about to alter the column `rate` on the `Commission` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(5,2)`.
  - You are about to alter the column `amount` on the `Commission` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to drop the column `minimumAmount` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `usedCount` on the `Coupon` table. All the data in the column will be lost.
  - You are about to alter the column `discountValue` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `maximumDiscount` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to drop the column `soldQuantity` on the `FlashSaleProduct` table. All the data in the column will be lost.
  - You are about to alter the column `salePrice` on the `FlashSaleProduct` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to drop the column `sellerId` on the `Order` table. All the data in the column will be lost.
  - You are about to alter the column `subtotal` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `shippingFee` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `discount` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `total` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to drop the column `variantId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to alter the column `unitPrice` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `totalPrice` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to drop the column `provider` on the `Payment` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to drop the column `paidAt` on the `Payout` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Payout` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - The `status` column on the `Payout` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `isFlashSale` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stockQuantity` on the `Product` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `compareAtPrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to drop the column `attributes` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `stockQuantity` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `ProductVariant` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to drop the column `returnId` on the `Refund` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Refund` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Refund` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to drop the column `createdAt` on the `ReturnRequest` table. All the data in the column will be lost.
  - You are about to drop the column `refundAmount` on the `ReturnRequest` table. All the data in the column will be lost.
  - You are about to drop the column `approvedAt` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the column `commissionRate` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the column `businessName` on the `SellerApplication` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `SellerApplication` table. All the data in the column will be lost.
  - You are about to drop the column `documents` on the `SellerApplication` table. All the data in the column will be lost.
  - You are about to drop the column `rejectionReason` on the `SellerApplication` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SellerApplication` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cartId,productId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `Refund` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reference]` on the table `Refund` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `SellerApplication` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullName` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `sku` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sku` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `orderId` to the `Refund` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `ReturnRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_variantId_fkey";

-- DropForeignKey
ALTER TABLE "Commission" DROP CONSTRAINT "Commission_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Commission" DROP CONSTRAINT "Commission_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_variantId_fkey";

-- DropForeignKey
ALTER TABLE "Payout" DROP CONSTRAINT "Payout_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Refund" DROP CONSTRAINT "Refund_returnId_fkey";

-- DropForeignKey
ALTER TABLE "ReturnRequest" DROP CONSTRAINT "ReturnRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "WishlistItem" DROP CONSTRAINT "WishlistItem_productId_fkey";

-- DropIndex
DROP INDEX "Address_isDefault_idx";

-- DropIndex
DROP INDEX "Brand_name_idx";

-- DropIndex
DROP INDEX "Brand_name_key";

-- DropIndex
DROP INDEX "CartItem_cartId_idx";

-- DropIndex
DROP INDEX "CartItem_cartId_productId_variantId_key";

-- DropIndex
DROP INDEX "CartItem_variantId_idx";

-- DropIndex
DROP INDEX "Category_name_idx";

-- DropIndex
DROP INDEX "Commission_orderId_key";

-- DropIndex
DROP INDEX "Order_addressId_idx";

-- DropIndex
DROP INDEX "Order_sellerId_idx";

-- DropIndex
DROP INDEX "OrderItem_variantId_idx";

-- DropIndex
DROP INDEX "Payment_createdAt_idx";

-- DropIndex
DROP INDEX "Payout_createdAt_idx";

-- DropIndex
DROP INDEX "Product_createdAt_idx";

-- DropIndex
DROP INDEX "Product_isFlashSale_idx";

-- DropIndex
DROP INDEX "Refund_returnId_key";

-- DropIndex
DROP INDEX "Refund_status_idx";

-- DropIndex
DROP INDEX "Review_rating_idx";

-- DropIndex
DROP INDEX "Seller_storeName_idx";

-- DropIndex
DROP INDEX "SellerApplication_createdAt_idx";

-- DropIndex
DROP INDEX "SellerApplication_userId_idx";

-- DropIndex
DROP INDEX "Shipment_courier_idx";

-- DropIndex
DROP INDEX "WishlistItem_wishlistId_idx";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "fullName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "variantId";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Commission" DROP COLUMN "orderId",
ADD COLUMN     "orderItemId" TEXT,
ALTER COLUMN "rate" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "minimumAmount",
DROP COLUMN "usedCount",
ADD COLUMN     "minimumPurchase" DECIMAL(12,2),
ADD COLUMN     "usageCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "discountValue" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "maximumDiscount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "FlashSale" ALTER COLUMN "isActive" SET DEFAULT true;

-- AlterTable
ALTER TABLE "FlashSaleProduct" DROP COLUMN "soldQuantity",
ADD COLUMN     "soldCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "salePrice" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "sellerId",
ADD COLUMN     "couponId" TEXT,
ALTER COLUMN "addressId" DROP NOT NULL,
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "shippingFee" DROP DEFAULT,
ALTER COLUMN "shippingFee" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "discount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "total" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "variantId",
ADD COLUMN     "sellerId" TEXT,
ADD COLUMN     "sku" TEXT NOT NULL,
ALTER COLUMN "unitPrice" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "totalPrice" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "provider",
ADD COLUMN     "gateway" TEXT,
ADD COLUMN     "gatewayData" JSONB,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Payout" DROP COLUMN "paidAt",
ADD COLUMN     "processedAt" TIMESTAMP(3),
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2),
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isFlashSale",
DROP COLUMN "stockQuantity",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "rating" DECIMAL(3,2),
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shortDescription" TEXT,
ALTER COLUMN "sellerId" DROP NOT NULL,
ALTER COLUMN "sku" SET NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "compareAtPrice" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "attributes",
DROP COLUMN "stockQuantity",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "sku" SET NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Refund" DROP COLUMN "returnId",
DROP COLUMN "status",
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "reason" TEXT,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "ReturnRequest" DROP COLUMN "createdAt",
DROP COLUMN "refundAmount",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "approvedAt",
DROP COLUMN "commissionRate";

-- AlterTable
ALTER TABLE "SellerApplication" DROP COLUMN "businessName",
DROP COLUMN "createdAt",
DROP COLUMN "documents",
DROP COLUMN "rejectionReason",
DROP COLUMN "updatedAt",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Shipment" ALTER COLUMN "shippingAddress" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Wishlist" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Brand_isActive_idx" ON "Brand"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_productId_key" ON "CartItem"("cartId", "productId");

-- CreateIndex
CREATE INDEX "Category_isActive_idx" ON "Category"("isActive");

-- CreateIndex
CREATE INDEX "Category_sortOrder_idx" ON "Category"("sortOrder");

-- CreateIndex
CREATE INDEX "OrderItem_sellerId_idx" ON "OrderItem"("sellerId");

-- CreateIndex
CREATE INDEX "Payout_status_idx" ON "Payout"("status");

-- CreateIndex
CREATE INDEX "Product_isActive_idx" ON "Product"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Refund_orderId_key" ON "Refund"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Refund_reference_key" ON "Refund"("reference");

-- CreateIndex
CREATE INDEX "Refund_processedAt_idx" ON "Refund"("processedAt");

-- CreateIndex
CREATE INDEX "ReturnRequest_productId_idx" ON "ReturnRequest"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "SellerApplication_userId_key" ON "SellerApplication"("userId");

-- CreateIndex
CREATE INDEX "SellerApplication_submittedAt_idx" ON "SellerApplication"("submittedAt");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnRequest" ADD CONSTRAINT "ReturnRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnRequest" ADD CONSTRAINT "ReturnRequest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerApplication" ADD CONSTRAINT "SellerApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
