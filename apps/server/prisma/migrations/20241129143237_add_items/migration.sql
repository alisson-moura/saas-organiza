/*
  Warnings:

  - You are about to alter the column `title` on the `lists` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('pending', 'processing', 'done');

-- CreateEnum
CREATE TYPE "ItemPriority" AS ENUM ('high', 'low', 'medium');

-- DropForeignKey
ALTER TABLE "lists" DROP CONSTRAINT "lists_group_id_fkey";

-- AlterTable
ALTER TABLE "lists" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(100);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "status" "ItemStatus" NOT NULL DEFAULT 'pending',
    "priority" "ItemPriority" NOT NULL DEFAULT 'medium',
    "listId" INTEGER NOT NULL,
    "assignedId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "items_listId_assignedId_idx" ON "items"("listId", "assignedId");

-- CreateIndex
CREATE UNIQUE INDEX "items_listId_title_key" ON "items"("listId", "title");

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_listId_fkey" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_assignedId_fkey" FOREIGN KEY ("assignedId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
