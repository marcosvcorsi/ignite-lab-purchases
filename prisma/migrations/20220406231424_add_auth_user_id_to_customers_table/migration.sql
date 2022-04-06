/*
  Warnings:

  - A unique constraint covering the columns `[auth_user_id]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "auth_user_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "customers_auth_user_id_key" ON "customers"("auth_user_id");
