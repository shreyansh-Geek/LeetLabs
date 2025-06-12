-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "cardLast4" TEXT,
ADD COLUMN     "cardNetwork" TEXT,
ADD COLUMN     "paymentMethod" TEXT;

-- CreateIndex
CREATE INDEX "Payment_razorpayOrderId_idx" ON "Payment"("razorpayOrderId");
