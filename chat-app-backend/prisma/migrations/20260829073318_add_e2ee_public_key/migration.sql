-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "encryptedVersion" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "PublicKey" TEXT;
