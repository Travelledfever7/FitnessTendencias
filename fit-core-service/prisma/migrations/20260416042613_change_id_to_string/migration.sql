/*
  Warnings:

  - The primary key for the `workspaces` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `workspaces` table. All the data in the column will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "workspaces" DROP CONSTRAINT "workspaces_pkey",
DROP COLUMN "id",
ALTER COLUMN "idEntrenador" SET DATA TYPE TEXT,
ADD CONSTRAINT "workspaces_pkey" PRIMARY KEY ("idEntrenador");

-- DropTable
DROP TABLE "Client";
