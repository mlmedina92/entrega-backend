import { Router } from "express";
import { jwtValidation } from "../middlewares/jwt.middleware.js";

const router = Router();

router.get("/current", jwtValidation, (req, res) => {
  const user = req.user;
  res.json({ user }); // Imprime la información incluida en el token JWT
});

export default router;