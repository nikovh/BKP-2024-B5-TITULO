import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

const useFetchDatos = (expedienteId) => {
    const [datos, setDatos] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!expedienteId) return;

        const fetchDatos = async () => {
            try {
                setError(null); // Limpia errores anteriores

                // Llamada al nuevo endpoint unificado
                const response = await fetch(`${API_URL}/expedientes/${expedienteId}/detalle`);
                if (!response.ok) throw new Error("Error al cargar los datos del expediente.");

                const data = await response.json();
                setDatos(data); // Almacena los datos
            } catch (err) {
                console.error("Error en useFetchDatos:", err);
                setError(err.message);
            }
        };

        fetchDatos();
    }, [expedienteId]);

    return { datos, error };
};

export default useFetchDatos;
