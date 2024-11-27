/*
  Warnings:

  - You are about to drop the column `name` on the `lists` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[group_id,title]` on the table `lists` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `lists` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "lists_group_id_name_key";

-- AlterTable
ALTER TABLE "lists" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "lists_group_id_title_key" ON "lists"("group_id", "title");
