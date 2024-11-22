-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "owner_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
