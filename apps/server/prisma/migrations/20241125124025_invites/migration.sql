-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('Accepted', 'Rejected', 'Canceled', 'Pending');

-- CreateTable
CREATE TABLE "invites" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "recipient_email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'Observador',
    "status" "InviteStatus" NOT NULL DEFAULT 'Pending',
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "invites_group_id_idx" ON "invites"("group_id");

-- CreateIndex
CREATE INDEX "invites_recipient_email_idx" ON "invites"("recipient_email");

-- CreateIndex
CREATE INDEX "invites_status_idx" ON "invites"("status");

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
