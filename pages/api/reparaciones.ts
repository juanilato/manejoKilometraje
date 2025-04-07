// pages/api/reparaciones.ts
import { prisma } from '../../lib/prisma'; 
import { NextApiRequest, NextApiResponse } from "next";
import { sendTelegramMessage } from "../../lib/sendTelegramMessage";


interface ReparacionRequestBody {
    fecha: string;
    kilometraje: number;
    vehiculoId: number;
    reparacion: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const reparaciones = await prisma.reparacion.findMany({
            include: { vehiculo: true },
        });
        return res.status(200).json(reparaciones);
    }

    if (req.method === "POST") {
        const { fecha, kilometraje, vehiculoId, reparacion } = req.body as ReparacionRequestBody;
      
        const nueva = await prisma.reparacion.create({
          data: {
            fecha: new Date(fecha),
            kilometraje,
            vehiculoId,
            reparacion,
          },
        });
      
        // Buscar el vehículo relacionado para incluir en el mensaje
        const auto = await prisma.auto.findUnique({
          where: { id: vehiculoId },
        });
      
        // Enviar mensaje a Telegram
        if (auto) {
          const mensaje = `🔧 Se registró una nueva reparación:\n\n🚗 ${auto.marca} ${auto.modelo} (${auto.patente})\n📅 ${new Date(fecha).toLocaleDateString()}\n🛠️ ${reparacion}\n📍 ${kilometraje} km`;
      
          await sendTelegramMessage(mensaje);
        }
      
        return res.status(201).json(nueva);
      }
      

    res.status(405).json({ message: "Método no permitido" });
}
