import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./rutas/authRoutes.js";
import tareaRoutes from "./rutas/tareaRoutes.js";

dotenv.config(); // <- Esto carga las variables del .env
// console.log("MONGO_URI =", process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexión a MongoDB usando la variable de entorno
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB conectado"))
.catch(err => console.error("Error MongoDB:", err));

app.use("/api/auth", authRoutes);
app.use("/api/tareas", tareaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
