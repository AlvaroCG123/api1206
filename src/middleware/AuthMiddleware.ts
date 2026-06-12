import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import type { Cargo } from '../../generated/prisma/enums.js';

export interface AuthRequest extends Request {
    usuarioId?: number,
    cargo?: Cargo
}

export function AuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const AuthHeader = req.headers.authorization
    if (!AuthHeader || !AuthHeader.startsWith("Bearer ")) {
        res.status(400).json({ error: "Token Inválido." })
        return
    }
    const token = AuthHeader.split(" ")[1]!
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as ({
            id: number,
            cargo: Cargo
        })
        req.usuarioId = payload.id
        req.cargo = payload.cargo

        next()
    } catch (error) {
        res.status(400).json({ error: "Token Inválido ou expirado." })
        return
    }
}

export function VerificarCargo(CargosPermitidos: Cargo[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.cargo) {
            res.status(400).json({ error: "Acesso negado: Cargo não identificado." })
            return
        }
        if (!CargosPermitidos.includes(req.cargo)) {
            res.status(400).json({ error: "Acesso negado: Cargo não pode concluir ação." })
            return
        }
        next()
    }
}