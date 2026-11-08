-- CreateEnum
CREATE TYPE "BoardRole" AS ENUM ('EDITOR', 'VIEWER');

-- AlterTable
ALTER TABLE "board_members" ADD COLUMN     "role" "BoardRole" NOT NULL DEFAULT 'EDITOR';

-- CreateTable
CREATE TABLE "card_activities" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "actorId" TEXT,
    "type" TEXT NOT NULL,
    "body" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "card_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "card_activities_cardId_createdAt_idx" ON "card_activities"("cardId", "createdAt");

-- CreateIndex
CREATE INDEX "card_activities_boardId_createdAt_idx" ON "card_activities"("boardId", "createdAt");

-- AddForeignKey
ALTER TABLE "card_activities" ADD CONSTRAINT "card_activities_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_activities" ADD CONSTRAINT "card_activities_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_activities" ADD CONSTRAINT "card_activities_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
