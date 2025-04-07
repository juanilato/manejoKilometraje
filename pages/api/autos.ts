import { prisma } from '../../lib/prisma'; 
import { NextApiRequest, NextApiResponse } from 'next';
import { sendTelegramMessage } from '../../lib/sendTelegramMessage';


interface AutoRequestBody {
    marca: string;
    modelo: string;
    patente: string;
    kilometraje: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const autos = await prisma.auto.findMany({ include: { reparaciones: true } });
        res.json(autos);
    } else if (req.method === 'POST') {
        const { marca, modelo, patente, kilometraje }: AutoRequestBody = req.body;
        const auto = await prisma.auto.create({
            data: { marca, modelo, patente, kilometraje },
        });
        await sendTelegramMessage(`📍 Se ingreso un nuevo vehículo ${auto.marca} ${auto.modelo} (${auto.patente}) kilometraje inicial: ${auto.kilometraje} `);
        res.status(201).json(auto);
    } else {
        res.status(405).json({ message: 'Método no permitido' });
    }
}
