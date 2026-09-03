/*
  Warnings:

  - You are about to drop the column `PublicKey` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "PublicKey",
ADD COLUMN     "publicKey" TEXT;
