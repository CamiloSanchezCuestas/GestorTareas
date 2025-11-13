import Tarea from "../modelos/tarea.js";

// Crear tarea
export const crearTarea = async (req, res) => {
  try {
    const { titulo, descripcion, prioridad, estado } = req.body;
    const tarea = new Tarea({
      titulo,
      descripcion,
      prioridad,
      estado,
      usuario: req.userId, // viene del JWT
    });
    await tarea.save();
    res.status(201).json(tarea);
  } catch (error) {
    console.error("Error al crear tarea:", error);
    res.status(500).json({ message: "Error al crear tarea" });
  }
};

// Obtener tareas del usuario
export const obtenerTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find({ usuario: req.userId });
    res.json(tareas);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    res.status(500).json({ message: "Error al obtener tareas" });
  }
};

// actualizar tarea
export const actualizarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, prioridad, estado } = req.body;

    const tareaActualizada = await Tarea.findOneAndUpdate(
      { _id: id, usuario: req.userId },
      { titulo, descripcion, prioridad, estado },
      { new: true } // retorna la tarea actualizada
    );

    if (!tareaActualizada) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.json(tareaActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar tarea" });
  }
};

// Eliminar tarea
export const eliminarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    await Tarea.findOneAndDelete({ _id: id, usuario: req.userId });
    res.json({ message: "Tarea eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar tarea" });
  }
};
