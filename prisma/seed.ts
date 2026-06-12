import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma.js'
import type { Prisma } from '../generated/prisma/client.js'

export async function main() {
    try {
        const adminHash = await bcrypt.hash("admin123", 10)
        const recepcaoHash = await bcrypt.hash("recepcao123", 10)

        const admin = await prisma.usuario.create({
            data:{
                nome:"admin",
                cpf:"000.000.000-01",
                email:"admin@weddding.com",
                senha: adminHash,
                cargo: 'ADMIN'
            }
        })

        const recepcao = await prisma.usuario.create({
            data:{
                nome:"recepcao",
                cpf:"000.000.000-02",
                email:"recepcao@weddding.com",
                senha: recepcaoHash,
                cargo: 'RECEPCIONISTA'
            }
        })

        const GeradorConvidado: Prisma.ConvidadoCreateManyInput[] = Array.from({length:30}).map((_,index)=>({
            nome:`Convidado`,
            sobrenome:`Teste ${index+1}`,
            cpf:`111.111.111-${(index+1).toString().padStart(2,`0`)}`,
            telefone:`539999999${(index+1).toString().padStart(2,`0`)}`,
            email:`convidado${index+1}@teste.com`,
            mesa:Math.floor(index/5)+1,
            usuarioId:admin.id,
            status:false
        }))

        await prisma.convidado.createMany({
            data: GeradorConvidado
        })

        console.log("seed rodando")
    } catch (error) {
        console.error("falha no seed: ",error)
    }finally{
        await prisma.$disconnect()
    }
}

await main()