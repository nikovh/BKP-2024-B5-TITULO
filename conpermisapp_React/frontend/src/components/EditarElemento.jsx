import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../styles/Edicion.css"


const EditarElemento = () => {
    const { id } = useParams(); // Obtiene el ID de la URL
    const [itemData, setItemData] = useState(null);
    const [entityType, setEntityType] = useState(""); 
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Detectar el tipo de entidad desde la URL
        const pathSegments = window.location.pathname.split("/");
        const type = pathSegments[pathSegments.length - 2];
        setEntityType(type);

        if (!["usuarios", "propietarios", "propiedades", "expedientes"].includes(type)) {
            setError("Tipo de entidad no válido.");
            return;
        }

         // Obtener los datos del registro para editar
         const fetchData = async () => {
            try {
                let endpoint;
                if (type === "usuarios" || type === "propietarios") {
                    endpoint = `http://localhost:4000/${type}?rut=${id}`;
                } else if (type === "propiedades") {
                    endpoint = `http://localhost:4000/${type}?expedienteId=${id}`;
                } else if (type === "expedientes") {
                    endpoint = `http://localhost:4000/${type}/${id}`;
                }
    
                const response = await fetch(endpoint);
                if (!response.ok) throw new Error("Error al obtener los datos.");
                const data = await response.json();
    
                // Asegurarse de manejar la respuesta como array o objeto
                setItemData(Array.isArray(data) ? data[0] : data);
            } catch (err) {
                setError(err.message);
                console.error(err);
            }
        };
    
        if (id) fetchData();
    }, [id]);

    const handleSaveEdit = async () => {
        if (!itemData || !entityType) return;

        try {
            const endpoint =
                entityType === "usuarios" || entityType === "propietarios"
                    ? "rut"
                    : "id";
            const idOrRut = itemData[endpoint];

            const response = await fetch(
                `http://localhost:4000/${entityType}/${idOrRut}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(itemData),
                }
            );

            if (!response.ok) throw new Error("Error al actualizar el registro.");

            alert("Registro actualizado exitosamente.");
            navigate("/administracion"); 
        } catch (err) {
            alert("Ocurrió un error al intentar actualizar el registro.");
            console.error(err);
        }
    };

    const validateInput = (key, value) => {
        // Agregar validaciones específicas por tipo de campo
        if (key.includes("id") || key.includes("Id") || typeof value === "number") {
            return !isNaN(value); // Validar que sea numérico
        }
        return true; // Por defecto, aceptar cualquier otro valor
    };

    if (error) return <p>Error: {error}</p>;
    if (!itemData) return <p>No se encontraron datos para este elemento.</p>;

    return (
        <div>
            <h1>Editando {entityType === "usuarios" ? "Usuario" : entityType}</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveEdit();
                }}
            >
                {Object.keys(itemData).map((key) => (
                    <div key={key} className="form-group">
                        <label>{key}</label>
                        <input
                            type="text"
                            value={itemData[key] || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (validateInput(key, value)) {
                                    setItemData({ ...itemData, [key]: value });
                                } else {
                                    alert(`Valor inválido para el campo ${key}.`);
                                }
                            }}
                        />
                    </div>
                ))}
                <button type="submit">Guardar Cambios</button>
                <button
                    type="button"
                    onClick={() => navigate("/administracion")}
                    style={{ marginLeft: "10px" }}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditarElemento;

