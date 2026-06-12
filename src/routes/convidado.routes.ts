import { Router } from "express";
import { AtualizarConvidado, Checkin, CriarConvidados, DeletarConvidado, ListarConvidados, PesquisaConvidado } from "../controller/convidado.controller.js";
import { AuthMiddleware, VerificarCargo } from "../middleware/AuthMiddleware.js";

const router = Router()

router.use(AuthMiddleware)

router.get("/listar", VerificarCargo(["ADMIN", "RECEPCIONISTA"]), ListarConvidados)
router.get("/pesquisa", VerificarCargo(["ADMIN", "RECEPCIONISTA"]), PesquisaConvidado)
router.post("/criar",  VerificarCargo(["ADMIN"]), CriarConvidados)
router.put("/atualizar", VerificarCargo(["ADMIN"]), AtualizarConvidado)
router.patch("/checkin", VerificarCargo(["ADMIN", "RECEPCIONISTA"]), Checkin)
router.delete("/deletar", VerificarCargo(["ADMIN"]), DeletarConvidado)

export default router