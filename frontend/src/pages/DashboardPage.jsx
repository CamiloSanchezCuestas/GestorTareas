import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function DashboardPage() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState("media");
  const [estado, setEstado] = useState("pendiente");
  const [filtro, setFiltro] = useState({ estado: "", prioridad: "" });
  const [editando, setEditando] = useState(false);
  const [tareaEditando, setTareaEditando] = useState(null);

  const { logout, token, usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      obtenerTareas();
    }
  }, [token]);

  const obtenerTareas = async () => {
    try {
      const res = await api.get("/tareas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTareas(res.data);
    } catch (err) {
      console.error("Error al obtener tareas", err);
    }
  };

  const crearTarea = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/tareas",
        { titulo, descripcion, prioridad, estado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      limpiarFormulario();
      obtenerTareas();
    } catch (err) {
      console.error("Error al crear tarea", err);
    }
  };

  const iniciarEdicion = (tarea) => {
    setEditando(true);
    setTareaEditando(tarea);
    setTitulo(tarea.titulo);
    setDescripcion(tarea.descripcion);
    setPrioridad(tarea.prioridad);
    setEstado(tarea.estado);
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/tareas/${tareaEditando._id}`,
        { titulo, descripcion, prioridad, estado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      limpiarFormulario();
      setEditando(false);
      setTareaEditando(null);
      obtenerTareas();
    } catch (err) {
      console.error("Error al actualizar tarea", err);
    }
  };

  const limpiarFormulario = () => {
    setTitulo("");
    setDescripcion("");
    setPrioridad("media");
    setEstado("pendiente");
  };

  const cancelarEdicion = () => {
    limpiarFormulario();
    setEditando(false);
    setTareaEditando(null);
  };

  const eliminarTarea = async (id) => {
    try {
      await api.delete(`/tareas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      obtenerTareas();
    } catch (err) {
      console.error("Error al eliminar tarea", err);
    }
  };

  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

  const tareasFiltradas = tareas.filter((t) => {
    return (
      (filtro.estado ? t.estado === filtro.estado : true) &&
      (filtro.prioridad ? t.prioridad === filtro.prioridad : true)
    );
  });

  return (
    <div className="page-container">
      <div className="header">
        <h1>EZToDo: by Davivienda</h1>
        <button onClick={cerrarSesion} className="button logout-button">
          Cerrar sesión
        </button>
      </div>

      <form
        onSubmit={editando ? guardarEdicion : crearTarea}
        className="form-container"
      >
        <h2>{editando ? "Editar Tarea" : "Crear Tarea"}</h2>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="pendiente">Pendiente</option>
          <option value="en proceso">En proceso</option>
          <option value="completada">Completada</option>
        </select>
        <div className="form-buttons">
          <button type="submit" className="button">
            {editando ? "Guardar cambios" : "Crear tarea"}
          </button>
          {editando && (
            <button type="button" className="button cancel-button" onClick={cancelarEdicion}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="filters">
        <select
          value={filtro.estado}
          onChange={(e) => setFiltro({ ...filtro, estado: e.target.value })}
        >
          <option value="">Filtrar por estado</option>
          <option value="pendiente">Pendiente</option>
          <option value="en proceso">En proceso</option>
          <option value="completada">Completada</option>
        </select>
        <select
          value={filtro.prioridad}
          onChange={(e) => setFiltro({ ...filtro, prioridad: e.target.value })}
        >
          <option value="">Filtrar por prioridad</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      <div className="task-list">
        {tareasFiltradas.map((t) => (
          <div key={t._id} className="task-card">
            <div>
              <h3>{t.titulo}</h3>
              <p>{t.descripcion}</p>
              <p>
                <strong>Prioridad:</strong> {t.prioridad} | <strong>Estado:</strong>{" "}
                {t.estado}
              </p>
            </div>
            <div className="task-buttons">
              <button className="button edit-button" onClick={() => iniciarEdicion(t)}>
                Editar
              </button>
              <button className="button delete-button" onClick={() => eliminarTarea(t._id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
