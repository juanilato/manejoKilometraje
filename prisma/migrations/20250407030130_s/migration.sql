/*
  Warnings:

  - Added the required column `reparacion` to the `Reparacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reparacion" ADD COLUMN     "reparacion" TEXT NOT NULL;
