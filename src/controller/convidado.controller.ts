import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import type { AuthRequest } from "../middleware/AuthMiddleware.js";


export async function EstatisticaDashboard(req: Request, res: Response) {
    try {
        const total = await prisma.convidado.count()
        const confirmados = await prisma.convidado.count({ where: { status: true } })
        const pendentes = total - confirmados

        res.status(200).json({ total, confirmados, pendentes })
    } catch (error) {
        res.status(500).json({ error: "Falha ao entregar dados." })
        return
    }
}

export async function ListarConvidados(req: Request, res: Response) {
    try {
        const listar = await prisma.convidado.findMany({
            orderBy: { nome: 'asc' },
            select: {
                id: true,
                nome: true,
                sobrenome: true,
                cpf: true,
                telefone: true,
                email:true,
                mesa: true,
                status: true
            }
        })

        res.status(200).json(listar)
    } catch (error) {
        res.status(500).json({ error: "Falha ao listar convidados." })
        return
    }
}

export async function PesquisaConvidado(req: Request, res: Response) {
    try {
        const { nome } = req.query
        const pesquisa = await prisma.convidado.findMany({
            where: {
                nome: { contains: nome ? String(nome) : '' }
            },
            orderBy: { nome: 'asc' },
            select: {
                id: true,
                nome: true,
                sobrenome: true,
                telefone: true,
                email:true,
                cpf: true,
                mesa: true,
                status: true
            }
        })

        res.status(200).json(pesquisa)
    } catch (error) {
        res.status(500).json({ error: "Falha ao pesquisar convidado." })
        return
    }
}

export async function CriarConvidados(req: AuthRequest, res: Response) {
    try {
        const { id, nome, sobrenome, cpf, telefone, email, mesa, status } = req.body

        const usuarioId = req.usuarioId
        if (!usuarioId) {
            res.status(401).json({ error: "usuario não identificado." })
            return
        }
        if (!nome || !sobrenome || !cpf || !telefone || !email || !mesa || status === undefined) {
            res.status(400).json({ error: "Dados faltando." })
            return
        }

        const usuarioExiste = await prisma.convidado.findFirst({
            where:{
                OR: [
                    { email },
                    { cpf }
                ]
            }
        })

        if(usuarioExiste){
            if(usuarioExiste.email === email){
                res.status(409).json({error: "Este email já esta cadastrado."})
                return
            }
            if(usuarioExiste.cpf === cpf){
                res.status(409).json({error: "Este cpf já esta cadastrado."})
                return
            }
        }

        const criar = await prisma.convidado.create({
            data: { nome, sobrenome, cpf, telefone, email, mesa, status, usuarioId },
            select: {
                id: true,
                nome: true,
                sobrenome: true,
                cpf: true,
                mesa: true,
                status: true
            }
        })

        res.status(201).json(criar)
    } catch (error) {

        res.status(500).json({ error: "Falha ao criar convidado." })
        return
    }
}

export async function AtualizarConvidado(req: AuthRequest, res: Response) {
    try {
        const { nome, sobrenome, cpf, telefone, email, mesa, status } = req.body
        const { id } = req.params
        if (!id) {
            res.status(400).json({ error: "ID inválido." })
            return
        }
        const usuario = await prisma.convidado.findUnique({
            where: { id: Number(id) }
        })

        if (!usuario) {
            res.status(404).json({ error: "Convidado não encontrado." })
            return
        }

        const usuarioId = req.usuarioId

        if (!usuarioId) {
            res.status(401).json({ error: "usuario não identificado." })
            return
        }
        if (!nome || !sobrenome || !cpf || !telefone || !email || !mesa || !status) {
            res.status(400).json({ error: "Dados faltando." })
            return
        }

        const usuarioExiste = await prisma.convidado.findFirst({
            where:{
                OR: [
                    { email },
                    { cpf }
                ]
            }
        })

        if(usuarioExiste){
            if(usuarioExiste.email === email){
                res.status(409).json({error: "Este email já esta cadastrado."})
                return
            }
            if(usuarioExiste.cpf === cpf){
                res.status(409).json({error: "Este cpf já esta cadastrado."})
                return
            }
        }

        const atualizar = await prisma.convidado.update({
            where: { id: Number(id) },
            data: { nome, sobrenome, cpf, telefone, email, mesa, status, usuarioId },
            select: {
                id: true,
                nome: true,
                sobrenome: true,
                cpf: true,
                mesa: true,
                status: true
            }
        })

        res.status(200).json(atualizar)
    } catch (error) {
        res.status(500).json({ error: "Falha ao atualizar convidado." })
        return
    }
}

export async function Checkin(req: AuthRequest, res: Response) {
    try {
        const { id } = req.params
        if (!id) {
            res.status(400).json({ error: "ID inválido." })
            return
        }
        const usuario = await prisma.convidado.findUnique({
            where: { id: Number(id) }
        })

        if (!usuario) {
            res.status(404).json({ error: "Convidado não encontrado." })
            return
        }

        if (usuario.status === true) {
            res.status(401).json({ error: "Convidado já fez Check-in." })
            return
        }

        const checkin = await prisma.convidado.update({
            where: { id: Number(id) },
            data: { status: true, checkin_em: new Date() },
            select: {
                id: true,
                nome: true,
                sobrenome: true,
                cpf: true,
                mesa: true,
                status: true
            }
        })

        res.status(200).json(checkin)
    } catch (error) {
        res.status(500).json({ error: "Falha ao fazer Check-in do convidado." })
        return
    }
}

export async function DeletarConvidado(req: AuthRequest, res: Response) {
    try {
        const { id } = req.params
        if (!id) {
            res.status(400).json({ error: "ID inválido." })
            return
        }
        const usuario = await prisma.convidado.findUnique({
            where: { id: Number(id) }
        })

        if (!usuario) {
            res.status(404).json({ error: "Convidado não encontrado." })
            return
        }

        const deletar = await prisma.convidado.delete({
            where: { id: Number(id) },
            select: {
                id: true,
                nome: true,
                sobrenome: true,
                cpf: true,
                mesa: true,
                status: true
            }
        })

        res.status(200).json(deletar)
    } catch (error) {
        res.status(500).json({ error: "Falha ao deletar convidado." })
        return
    }
}