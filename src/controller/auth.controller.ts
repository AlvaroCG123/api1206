import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';

export async function Login(req: Request, res: Response) {
    try {
        const { email, senha } = req.body

        if (!email || !senha) {
            res.status(400).json({ erro: "Email e Senha obrigatórios." })
            return
        }
        const usuario = await prisma.usuario.findUnique({
            where: { email }
        })

        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
            res.status(400).json({ error: "Email ou senha incorretos." })
            return
        }

        const token = jwt.sign(
            { id: usuario.id, cargo: usuario.cargo },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        )

        res.status(200).json({
            mensgaem: "Usuario logado com sucesso.",
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                cargo: usuario.cargo
            }
        })
    } catch (error) {
        console.error("Falha no login", error)
        res.status(500).json({ error: "Falha na Api" })
    }
}