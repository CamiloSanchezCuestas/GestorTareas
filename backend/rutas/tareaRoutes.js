import { Router } from "express";
import { crearTarea, obtenerTareas, eliminarTarea, actualizarTarea } from "../controladores/tareaController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", verificarToken, crearTarea);
router.get("/", verificarToken, obtenerTareas);
router.delete("/:id", verificarToken, eliminarTarea);
router.put("/:id", verificarToken, actualizarTarea); // NUEVO

export default router;
