-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Lider', 'Organizador', 'Participante', 'Observador');

-- CreateTable
CREATE TABLE "members" (
    "accountId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "role" "Role" NOT NULL
);

-- CreateIndex
CREATE INDEX "members_accountId_idx" ON "members"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "members_accountId_groupId_key" ON "members"("accountId", "groupId");
