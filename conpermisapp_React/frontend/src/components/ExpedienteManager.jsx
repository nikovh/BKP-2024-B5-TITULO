import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { auth } from "../firebase";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

function ExpedienteManager() {
    const { email } = useParams();
    const [expedientes, setExpedientes] = useState([]); // Inicializamos como un array vacío para evitar errores
    const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null); // Para edición
    const [formData, setFormData] = useState({
        descripcion: "",
        tipo: "",
        subtipo: "",
        estadoExpedienteId: "",
    });

    const [tipo, setTipo] = useState("");
    const [subtipo, setSubtipo] = useState("");
    const [tipoNombre, setTipoNombre] = useState("");
    const [subtipoNombre, setSubtipoNombre] = useState("");

    // Obtener expedientes del backend
    useEffect(() => {
        const fetchNombresYExpedientes = async () => {
            try {
                // Fetch tipos
                const tipoResponse = await fetch(`${API_URL}/expedientes/tipo-expediente`);
                const tipos = await tipoResponse.json();
    
                // Fetch subtipos
                const subtipoResponse = await fetch(`${API_URL}/expedientes/subtipo-expediente`);
                const subtipos = await subtipoResponse.json();
    
                // Fetch expedientes
                const usuarioEmail = email || auth.currentUser?.email;
                if (!usuarioEmail) {
                    console.error("El usuario no está autenticado.");
                    setExpedientes([]);
                    return;
                }
    
                const response = await fetch(`${API_URL}/expedientes?usuario_email=${usuarioEmail}`);
                const data = await response.json();
    
                if (Array.isArray(data)) {
                    // Mapear nombres de tipo y subtipo
                    const expedientesConNombres = data.map((exp) => ({
                        ...exp,
                        tipoNombre: tipos.find((t) => String(t.id) === String(exp.tipo))?.nombre || "Desconocido",
                        subtipoNombre: subtipos.find((st) => String(st.id) === String(exp.subtipo))?.nombre || "Desconocido",
                    }));
                    setExpedientes(expedientesConNombres);
                } else {
                    console.error("La respuesta no es un array:", data);
                    setExpedientes([]);
                }
            } catch (err) {
                console.error("Error al cargar datos:", err);
                setExpedientes([]);
            }
        };
    
        fetchNombresYExpedientes();
    }, [email]);

    // Seleccionar expediente para edición
    const handleEdit = (expediente) => {
        setExpedienteSeleccionado(expediente);
        setFormData({
            descripcion: expediente.descripcion,
            tipo: expediente.tipo,
            subtipo: expediente.subtipo,
            estadoExpedienteId: expediente.EstadoExpediente_id,
        });
    };

    // Guardar cambios al expediente
    const handleSave = async () => {
        if (!expedienteSeleccionado) return;

        try {
            const response = await fetch(`${API_URL}/expedientes/${expedienteSeleccionado.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Expediente actualizado exitosamente");
                // Refrescamos la lista de expedientes después de la edición
                const updatedExpedientes = expedientes.map((exp) =>
                    exp.id === expedienteSeleccionado.id ? { ...exp, ...formData } : exp
                );
                setExpedientes(updatedExpedientes);
                setExpedienteSeleccionado(null); // Salimos del modo edición
            } else {
                alert("Error al actualizar expediente");
            }
        } catch (error) {
            console.error("Error al guardar cambios:", error);
        }
    };

    // Eliminar un expediente
    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este expediente?")) return;

        try {
            const response = await fetch(`${API_URL}/expedientes/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Expediente eliminado");
                // Filtramos el expediente eliminado de la lista local
                setExpedientes(expedientes.filter((exp) => exp.id !== id));
            } else {
                alert("Error al eliminar expediente");
            }
        } catch (error) {
            console.error("Error al eliminar expediente:", error);
        }
    };

    // Manejar cambios en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // return (
    //     <div style={{ padding: "1rem" }}>
    //         <h1>Gestión de Expedientes</h1>

    //         {expedienteSeleccionado ? (
    //             <div>
    //                 <h2>Editar Expediente</h2>
    //                 <form onSubmit={(e) => e.preventDefault()}>
    //                     <div>
    //                         <label>Descripción:</label>
    //                         <input
    //                             type="text"
    //                             name="descripcion"
    //                             value={formData.descripcion}
    //                             onChange={handleInputChange}
    //                         />
    //                     </div>
    //                     <div>
    //                         <label>Tipo:</label>
    //                         <input
    //                             type="text"
    //                             name="tipo"
    //                             value={formData.tipo}
    //                             onChange={handleInputChange}
    //                         />
    //                     </div>
    //                     <div>
    //                         <label>Subtipo:</label>
    //                         <input
    //                             type="text"
    //                             name="subtipo"
    //                             value={formData.subtipo}
    //                             onChange={handleInputChange}
    //                         />
    //                     </div>
    //                     <div>
    //                         <label>Estado:</label>
    //                         <input
    //                             type="number"
    //                             name="estadoExpedienteId"
    //                             value={formData.estadoExpedienteId}
    //                             onChange={handleInputChange}
    //                         />
    //                     </div>
    //                     <button onClick={handleSave}>Guardar</button>
    //                     <button onClick={() => setExpedienteSeleccionado(null)}>Cancelar</button>
    //                 </form>
    //             </div>
    //         ) : (
    //             <div>
    //                 <h2>Lista de Expedientes</h2>
    //                 {expedientes.length === 0 ? (
    //                     <p>No hay expedientes disponibles.</p>
    //                 ) : (
    //                     <ul>
    //                         {expedientes.map((expediente) => (
    //                             <li key={expediente.id}>
    //                                 <strong>{expediente.descripcion}</strong> (Tipo: {expediente.tipo}, Subtipo: {expediente.subtipo})
    //                                 <button onClick={() => handleEdit(expediente)}>Editar</button>
    //                                 <button onClick={() => handleDelete(expediente.id)}>Eliminar</button>
    //                             </li>
    //                         ))}
    //                     </ul>
    //                 )}
    //             </div>
    //         )}
    //     </div>
    // );

    return (
        <div style={{ padding: "1rem" }}>
            <h1>Gestión de Expedientes</h1>
    
            {expedienteSeleccionado ? (
                <div>
                    <h2>Editar Expediente</h2>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label>Descripción:</label>
                            <input
                                type="text"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Tipo:</label>
                            <input
                                type="text"
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Subtipo:</label>
                            <input
                                type="text"
                                name="subtipo"
                                value={formData.subtipo}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Estado:</label>
                            <input
                                type="number"
                                name="estadoExpedienteId"
                                value={formData.estadoExpedienteId}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button onClick={handleSave}>Guardar</button>
                        <button onClick={() => setExpedienteSeleccionado(null)}>Cancelar</button>
                    </form>
                </div>
            ) : (
                <div>
                    <h2>Lista de Expedientes</h2>
                    {expedientes.length === 0 ? (
                        <p>No hay expedientes disponibles.</p>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>Descripción</th>
                                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>Tipo</th>
                                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>Subtipo</th>
                                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expedientes.map((expediente) => (
                                    <tr key={expediente.id}>
                                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{expediente.descripcion}</td>
                                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{tipoNombre}</td>
                                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{subtipoNombre}</td>
                                        <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                                            <div div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                                                <button onClick={() => handleEdit(expediente)}>Editar</button>
                                                <button onClick={() => handleDelete(expediente.id)}>Eliminar</button>
                                            </div>
                                            
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

export default ExpedienteManager;
