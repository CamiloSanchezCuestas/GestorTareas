import mongoose from "mongoose";

const tareaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  prioridad: { type: String, enum: ["baja", "media", "alta"], default: "media" },
  estado: { type: String, enum: ["pendiente", "en proceso", "completada"], default: "pendiente" },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
}, { timestamps: true });

const Tarea = mongoose.model("Tarea", tareaSchema);
export default Tarea;
