/*
import { useEffect, useState } from "react";

const useFetchDatos = (expedienteId) => {
    const [datos, setDatos] = useState({
        propiedad: null,
        propietario: null,
        expediente: null,
        usuario: null,
        tipoExpediente: null,
        subTipoExpediente: null,
        estadoExpediente: null,
    });
    const [error, setError] = useState(null);
    
    console.log("Intentando obtener datos para expedienteId:", expedienteId);
    useEffect(() => {
        if (!expedienteId) return;
        
        const fetchDatos = async () => {
            try {
                setError(null); // limpia errores previos

                // Obtener expediente
                console.log("Intentando obtener el expediente...");
                const expedienteResponse = await fetch(`http://localhost:4000/expedientes/${expedienteId}`);
                if (!expedienteResponse.ok) throw new Error("Error al obtener el expediente");
                const expediente = await expedienteResponse.json();
                console.log("Expediente obtenido:", expediente);
                setDatos((prev) => ({ ...prev, expediente }));

                // Obtener propiedad
                // if (expedienteId) {
                //     console.log("Intentando obtener la propiedad...");
                //     const propiedadResponse = await fetch(`http://localhost:4000/propiedades/expedientes/${expedienteId}`);
                //     if (!propiedadResponse.ok) throw new Error("Error al obtener la propiedad");
                //     const propiedad = await propiedadResponse.json();
                //     console.log("Propiedad obtenida:", propiedad);
                //     setDatos((prev) => ({ ...prev, propiedad }));
                // } else {
                //     console.warn("No se encontró un expedienteId para obtener la propiedad.");
                // }

                // Obtener propiedad
                const propiedadResponse = await fetch(`http://localhost:4000/propiedades/expedientes/${expedienteId}`);
                if (propiedadResponse.ok) {
                    const propiedad = await propiedadResponse.json();
                    setDatos((prev) => ({ ...prev, propiedad }));
                }

                // Obtener propietario
                if (expediente.propietarioRut) {
                    console.log("Intentando obtener el propietario...");
                    const propietarioResponse = await fetch(`http://localhost:4000/propietarios/${expediente.propietarioRut}`);
                    if (!propietarioResponse.ok) {
                        const propietario = await propietarioResponse.json();
                        console.log("Propietario obtenido:", propietario);
                        setDatos((prev) => ({ ...prev, propietario }));
                    } 
                } 


                // Obtener usuario
                if (expediente.Usuario_email) {
                    console.log("Intentando obtener el usuario...");
                    const usuarioResponse = await fetch(`http://localhost:4000/usuarios/email/${expediente.Usuario_email}`);
                    if (!usuarioResponse.ok) throw new Error("Error al obtener el usuario");
                    const usuario = await usuarioResponse.json();
                    setDatos((prev) => ({ ...prev, usuario }));
                } else {
                    console.warn("No se encontró un Usuario_email para obtener el usuario.");
                }

                // Obtener tipo expediente
                if (expediente.tipo) {
                    console.log("Intentando obtener el tipo de expediente...");
                    const tipoExpedienteResponse = await fetch(`http://localhost:4000/expedientes/tipo-expediente`);
                    if (!tipoExpedienteResponse.ok) throw new Error("Error al obtener el tipo de expediente");
                    const tipoExpediente = await tipoExpedienteResponse.json();
                    const tipoEncontrado = tipoExpediente.find((t) => t.id === expediente.tipo);
                    setDatos((prev) => ({ ...prev, tipoExpediente: tipoEncontrado || null }));
                }


                // Obtener subtipo expediente
                if (expediente.subtipo) {
                    console.log("Intentando obtener el subtipo de expediente...");
                    const subTipoExpedienteResponse = await fetch(`http://localhost:4000/expedientes/subtipo-expediente`);
                    if (!subTipoExpedienteResponse.ok) throw new Error("Error al obtener el subtipo de expediente");
                    const subTipoExpediente = await subTipoExpedienteResponse.json();
                    const subTipoEncontrado = subTipoExpediente.find((st) => st.id === expediente.subtipo);
                    setDatos((prev) => ({ ...prev, subTipoExpediente: subTipoEncontrado || null }));
                }

                if (expediente.estadoNombre) {
                    console.log("Estado del expediente:", expediente.estadoNombre);
                    setDatos((prev) => ({ ...prev, estadoExpediente: expediente.estadoNombre }));
                }

            } catch (err) {
                console.error("Error en el fetch:", err);
                setError(err.message);
            }
        };

        fetchDatos();
    }, [expedienteId]);

    return { datos, error };
};

export default useFetchDatos;
*/

//alternativa consulta unificada
import { useEffect, useState } from "react";

const useFetchDatos = (expedienteId) => {
    const [datos, setDatos] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!expedienteId) return;

        const fetchDatos = async () => {
            try {
                setError(null); // Limpia errores anteriores

                // Llamada al nuevo endpoint unificado
                const response = await fetch(`http://localhost:4000/expedientes/${expedienteId}/detalle`);
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
