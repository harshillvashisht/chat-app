/*
  Warnings:

  - You are about to drop the column `clientmessageId` on the `Message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clientMessageId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Message_clientmessageId_key";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "clientmessageId",
ADD COLUMN     "clientMessageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Message_clientMessageId_key" ON "Message"("clientMessageId");
