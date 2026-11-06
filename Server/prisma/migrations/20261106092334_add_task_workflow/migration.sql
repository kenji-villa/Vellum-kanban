-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('OPEN', 'SUBMITTED', 'DONE');

-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "assignedById" TEXT,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "status" "CardStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "submittedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "note" TEXT;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
