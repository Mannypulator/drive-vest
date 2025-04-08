-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_ratesId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_sellerInfoId_fkey";

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "isForSale" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "discount" DROP NOT NULL,
ALTER COLUMN "ratesId" DROP NOT NULL,
ALTER COLUMN "sellerInfoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_ratesId_fkey" FOREIGN KEY ("ratesId") REFERENCES "Rates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_sellerInfoId_fkey" FOREIGN KEY ("sellerInfoId") REFERENCES "SellerInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
