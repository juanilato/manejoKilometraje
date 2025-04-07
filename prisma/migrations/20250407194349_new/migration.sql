-- DropForeignKey
ALTER TABLE "Reparacion" DROP CONSTRAINT "Reparacion_vehiculoId_fkey";

-- AddForeignKey
ALTER TABLE "Reparacion" ADD CONSTRAINT "Reparacion_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Auto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
