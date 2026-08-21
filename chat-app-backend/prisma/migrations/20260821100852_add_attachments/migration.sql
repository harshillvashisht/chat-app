/*
  Warnings:

  - You are about to drop the column `url` on the `Attachment` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileSize` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objectKey` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "url",
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "fileSize" INTEGER NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "objectKey" TEXT NOT NULL;
