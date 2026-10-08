/*
  Warnings:

  - You are about to drop the column `fullName` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Brand` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `orderItemId` on the `Commission` table. All the data in the column will be lost.
  - You are about to drop the column `minimumPurchase` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `usageCount` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `soldCount` on the `FlashSaleProduct` table. All the data in the column will be lost.
  - You are about to drop the column `couponId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `sellerId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `gateway` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `gatewayData` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `processedAt` on the `Payout` table. All the data in the column will be lost.
  - The `status` column on the `Payout` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `isActive` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCount` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isPrimary` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Refund` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `Refund` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ReturnRequest` table. All the data in the column will be lost.
  - You are about to drop the column `requestedAt` on the `ReturnRequest` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `SellerApplication` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `SellerApplication` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedAt` on the `SellerApplication` table. All the data in the column will be lost.
  - You are about to drop the column `submittedAt` on the `SellerApplication` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Wishlist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cartId,productId,variantId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `Commission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[returnId]` on the table `Refund` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `Commission` table without a default value. This is not possible if the table is not empty.
  - Made the column `addressId` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sellerId` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `returnId` to the `Refund` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SellerApplication` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `SellerApplication` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shippingAddress` on table `Shipment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Commission" DROP CONSTRAINT "Commission_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_couponId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Payout" DROP CONSTRAINT "Payout_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Refund" DROP CONSTRAINT "Refund_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ReturnRequest" DROP CONSTRAINT "ReturnRequest_productId_fkey";

-- DropForeignKey
ALTER TABLE "ReturnRequest" DROP CONSTRAINT "ReturnRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "SellerApplication" DROP CONSTRAINT "SellerApplication_userId_fkey";

-- DropForeignKey
ALTER TABLE "WishlistItem" DROP CONSTRAINT "WishlistItem_productId_fkey";

-- DropIndex
DROP INDEX "Brand_isActive_idx";

-- DropIndex
DROP INDEX "CartItem_cartId_productId_key";

-- DropIndex
DROP INDEX "Category_isActive_idx";

-- DropIndex
DROP INDEX "Category_sortOrder_idx";

-- DropIndex
DROP INDEX "OrderItem_sellerId_idx";

-- DropIndex
DROP INDEX "Product_isActive_idx";

-- DropIndex
DROP INDEX "Refund_orderId_key";

-- DropIndex
DROP INDEX "Refund_processedAt_idx";

-- DropIndex
DROP INDEX "Refund_reference_key";

-- DropIndex
DROP INDEX "ReturnRequest_productId_idx";

-- DropIndex
DROP INDEX "SellerApplication_submittedAt_idx";

-- DropIndex
DROP INDEX "SellerApplication_userId_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "fullName",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "isActive";

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "variantId" TEXT;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "isActive",
DROP COLUMN "sortOrder";

-- AlterTable
ALTER TABLE "Commission" DROP COLUMN "orderItemId",
ADD COLUMN     "orderId" TEXT NOT NULL,
ALTER COLUMN "rate" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "minimumPurchase",
DROP COLUMN "usageCount",
ADD COLUMN     "minimumAmount" DECIMAL(65,30),
ADD COLUMN     "usedCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "discountValue" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "maximumDiscount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "FlashSale" ALTER COLUMN "isActive" SET DEFAULT false;

-- AlterTable
ALTER TABLE "FlashSaleProduct" DROP COLUMN "soldCount",
ADD COLUMN     "soldQuantity" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "salePrice" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "couponId",
ADD COLUMN     "sellerId" TEXT,
ALTER COLUMN "addressId" SET NOT NULL,
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "shippingFee" SET DEFAULT 0,
ALTER COLUMN "shippingFee" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "discount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "total" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "sellerId",
DROP COLUMN "sku",
ADD COLUMN     "variantId" TEXT,
ALTER COLUMN "unitPrice" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "totalPrice" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "gateway",
DROP COLUMN "gatewayData",
ADD COLUMN     "provider" TEXT,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Payout" DROP COLUMN "processedAt",
ADD COLUMN     "paidAt" TIMESTAMP(3),
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30),
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isActive",
DROP COLUMN "rating",
DROP COLUMN "reviewCount",
DROP COLUMN "shortDescription",
ADD COLUMN     "isFlashSale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stockQuantity" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "sellerId" SET NOT NULL,
ALTER COLUMN "sku" DROP NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "compareAtPrice" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "isPrimary";

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "isActive",
DROP COLUMN "stock",
ADD COLUMN     "attributes" JSONB,
ADD COLUMN     "stockQuantity" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "sku" DROP NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Refund" DROP COLUMN "orderId",
DROP COLUMN "reason",
ADD COLUMN     "returnId" TEXT NOT NULL,
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "ReturnRequest" DROP COLUMN "productId",
DROP COLUMN "requestedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "refundAmount" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "commissionRate" DECIMAL(65,30) NOT NULL DEFAULT 10;

-- AlterTable
ALTER TABLE "SellerApplication" DROP COLUMN "description",
DROP COLUMN "notes",
DROP COLUMN "reviewedAt",
DROP COLUMN "submittedAt",
ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "documents" JSONB,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "Shipment" ALTER COLUMN "shippingAddress" SET NOT NULL;

-- AlterTable
ALTER TABLE "Wishlist" DROP COLUMN "updatedAt";

-- CreateIndex
CREATE INDEX "Address_isDefault_idx" ON "Address"("isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE INDEX "Brand_name_idx" ON "Brand"("name");

-- CreateIndex
CREATE INDEX "CartItem_cartId_idx" ON "CartItem"("cartId");

-- CreateIndex
CREATE INDEX "CartItem_variantId_idx" ON "CartItem"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_productId_variantId_key" ON "CartItem"("cartId", "productId", "variantId");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Commission_orderId_key" ON "Commission"("orderId");

-- CreateIndex
CREATE INDEX "Order_addressId_idx" ON "Order"("addressId");

-- CreateIndex
CREATE INDEX "Order_sellerId_idx" ON "Order"("sellerId");

-- CreateIndex
CREATE INDEX "OrderItem_variantId_idx" ON "OrderItem"("variantId");

-- CreateIndex
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");

-- CreateIndex
CREATE INDEX "Payout_status_idx" ON "Payout"("status");

-- CreateIndex
CREATE INDEX "Payout_createdAt_idx" ON "Payout"("createdAt");

-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt");

-- CreateIndex
CREATE INDEX "Product_isFlashSale_idx" ON "Product"("isFlashSale");

-- CreateIndex
CREATE UNIQUE INDEX "Refund_returnId_key" ON "Refund"("returnId");

-- CreateIndex
CREATE INDEX "Refund_status_idx" ON "Refund"("status");

-- CreateIndex
CREATE INDEX "Review_rating_idx" ON "Review"("rating");

-- CreateIndex
CREATE INDEX "Seller_storeName_idx" ON "Seller"("storeName");

-- CreateIndex
CREATE INDEX "SellerApplication_createdAt_idx" ON "SellerApplication"("createdAt");

-- CreateIndex
CREATE INDEX "SellerApplication_userId_idx" ON "SellerApplication"("userId");

-- CreateIndex
CREATE INDEX "Shipment_courier_idx" ON "Shipment"("courier");

-- CreateIndex
CREATE INDEX "WishlistItem_wishlistId_idx" ON "WishlistItem"("wishlistId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnRequest" ADD CONSTRAINT "ReturnRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_returnId_fkey" FOREIGN KEY ("returnId") REFERENCES "ReturnRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
