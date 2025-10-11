-- AlterTable
ALTER TABLE "WithdrawalCheckpoint"
ADD COLUMN     "collectedSignatures" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "complianceNote" TEXT,
ADD COLUMN     "requiredSignatures" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "WithdrawalCheckpointSignature" (
    "id" TEXT NOT NULL,
    "checkpointId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "note" TEXT,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WithdrawalCheckpointSignature_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "WithdrawalCheckpointSignature_checkpointId_fkey" FOREIGN KEY ("checkpointId") REFERENCES "WithdrawalCheckpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "WithdrawalCheckpointSignature_checkpointId_adminId_key" ON "WithdrawalCheckpointSignature"("checkpointId", "adminId");
