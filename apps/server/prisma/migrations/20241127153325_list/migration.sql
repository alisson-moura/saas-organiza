-- CreateTable
CREATE TABLE "lists" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "group_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lists_group_id_idx" ON "lists"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "lists_group_id_name_key" ON "lists"("group_id", "name");

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
