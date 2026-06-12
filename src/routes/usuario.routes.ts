import { Router } from "express";
import { Login } from "../controller/auth.controller.js";

const router = Router()

router.post("/login", Login)

export default router