-- CreateTable
CREATE TABLE "Auto" (
    "id" SERIAL NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "patente" TEXT NOT NULL,
    "kilometraje" INTEGER NOT NULL,

    CONSTRAINT "Auto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reparacion" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "kilometraje" INTEGER NOT NULL,
    "vehiculoId" INTEGER NOT NULL,

    CONSTRAINT "Reparacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auto_patente_key" ON "Auto"("patente");

-- AddForeignKey
ALTER TABLE "Reparacion" ADD CONSTRAINT "Reparacion_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Auto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
