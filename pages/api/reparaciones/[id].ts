import { prisma } from '../../../lib/prisma'; 
import { NextApiRequest, NextApiResponse } from 'next';
import {sendTelegramMessage} from '../../../lib/sendTelegramMessage'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const id = parseInt(req.query.id as string);

    if (req.method === 'DELETE') {
        try {
            const reparacion = await prisma.reparacion.delete({
                where: { id }
            });
            const auto = await prisma.auto.findUnique({
                where: { id: reparacion.vehiculoId },
              });
            

            res.status(200).json(reparacion);
            if(auto){
            const mensaje = `🔧 Se eliminó una reparación:\n\n🚗 ${auto.marca} ${auto.modelo} (${auto.patente})\n📅 ${new Date(reparacion.fecha).toLocaleDateString()}\n🛠️ ${reparacion}\n📍 ${reparacion.kilometraje} km`;
            await sendTelegramMessage(mensaje);
            }
        } catch{
            res.status(500).json({ message: 'Error al eliminar la reparación' });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).json({ message: `Método ${req.method} no permitido` });
    }
}
