import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import {sendTelegramMessage} from '../../../lib/sendTelegramMessage'
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = parseInt(req.query.id as string);

  if (req.method === 'DELETE') {
    try {
      await prisma.reparacion.deleteMany({ where: { vehiculoId: id } });
      const auto = await prisma.auto.delete({ where: { id } });
      res.status(200).json(auto);
      await sendTelegramMessage(`📍 Se eliminó el vehículo ${auto.marca} ${auto.modelo} (${auto.patente}) de la base de datos`);
    } catch  {
      res.status(500).json({ message: 'Error al eliminar el vehículo' });
    }
  }

  else if (req.method === 'PUT') {
    try {
      const { kilometraje } = req.body;

      if (typeof kilometraje !== 'number' || kilometraje < 0) {
        return res.status(400).json({ message: 'Kilometraje inválido' });
      }

      const auto = await prisma.auto.update({
        where: { id },
        data: { kilometraje },
      });

      res.status(200).json(auto);
      await sendTelegramMessage(`📍 Se actualizó el kilometraje del vehículo ${auto.marca} ${auto.modelo} (${auto.patente}) a ${auto.kilometraje} km`);

    } catch  {
      res.status(500).json({ message: 'Error al actualizar el kilometraje' });
    }
  }

  else {
    res.setHeader('Allow', ['DELETE', 'PUT']);
    res.status(405).json({ message: `Método ${req.method} no permitido` });
  }
}
