import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Desplegable from "./FormPage/Desplegable";
import DatosPropiedad from "./FormPage/DatosPropiedad";
import DatosPropietario from "./FormPage/DatosPropietario";

import CargaOcupacion from "./Formularios/CargaOcupacion"
import SolicitudArt124 from "./Formularios/SolicitudArt124"
import FormDeclaracionProp from "./Formularios/FormDeclaracionProp";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

const ExpedienteDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [propiedad, setPropiedad] = useState(null);
    const [propietario, setPropietario] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                // Fetch propiedad, expediente y propietario en una sola llamada
                const response = await fetch(`${API_URL}/expedientes/${id}/detalle`);
                if (!response.ok) throw new Error("No se pudieron cargar los datos del expediente.");
                const data = await response.json();
    
                console.log("Datos del expediente recibidos:", data);
    
                // Establecer datos de propiedad y propietario desde la respuesta
                if (data.propiedad) {
                    setPropiedad(data.propiedad);
                } else {
                    console.warn("No se encontraron datos de la propiedad en la respuesta del servidor.");
                    setPropiedad(null);
                }
    
                if (data.propietario) {
                    setPropietario(data.propietario);
                } else {
                    console.warn("No se encontraron datos del propietario en la respuesta del servidor.");
                    setPropietario(null);
                }
            } catch (err) {
                console.error("Error al obtener los datos:", err);
                setError(err.message);
            }
        };
    
        if (id) fetchDatos();
    }, [id]);
    



    const handleSavePropiedad = (updatedPropiedad) => {
        setPropiedad(updatedPropiedad);
        console.log("Propiedad actualizada:", updatedPropiedad);
    };

    const handleSavePropietario = (updatedPropietario) => {
        setPropietario(updatedPropietario);
        console.log("Propietario actualizado:", updatedPropietario);
    };

    const handleCancel = () => {
        navigate("/dashboard");
    };

    // return (
    //     <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
    //         <h1>Detalles del Expediente</h1>
    //         {error ? (
    //             <p style={{ color: "red" }}>{error}</p>
    //         ) : (
    //             <>
    //                 <Desplegable title="Datos de la Propiedad">
    //                     {propiedad ? (
    //                         <DatosPropiedad 
    //                             propiedad={propiedad} 
    //                             onSave={handleSavePropiedad} 
    //                         />
    //                     ) : (
    //                         <p>Cargando datos de la propiedad...</p>
    //                     )}
    //                 </Desplegable>

    //                 <Desplegable title="Datos del Propietario">
    //                     {propietario ? (
    //                         <DatosPropietario 
    //                             propietario={propietario} 
    //                             onSave={handleSavePropietario} 
    //                         />
    //                     ) : (
    //                         <p>Cargando datos del propietario...</p>
    //                     )}
    //                 </Desplegable>
    //             </>
    //         )}

    //         <button onClick={handleCancel} style={{ marginTop: "20px" }}>Volver</button>
    //     </div>
    // );

    return (

        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>

            <h1>Detalles del Expediente</h1>
            {error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <>
                    <Desplegable title="Datos de la Propiedad">
                        {propiedad ? ( <DatosPropiedad propiedad={propiedad} onSave={handleSavePropiedad} /> ) : (<p>No se encontraron datos de la propiedad.</p> )}
                    </Desplegable>

                    <Desplegable title="Datos del Propietario">
                        {propietario ? ( <DatosPropietario propietario={propietario} onSave={handleSavePropietario} /> ) : ( <p>No se encontraron datos del propietario.</p> )}
                    </Desplegable>

                    <Desplegable title="Formulario 1: Declaracion Propietario">
                        <FormDeclaracionProp expedienteId={id} />
                    </Desplegable>
                    <Desplegable title="Informe 1: Carga de Ocupación">
                        <CargaOcupacion />
                    </Desplegable>
                    <Desplegable title="Documento especial 1: Solicitud Art. 124° LGUC ">
                        <SolicitudArt124 expedienteId={id} />
                    </Desplegable>

                </>
            )}

            <button onClick={handleCancel} style={{ marginTop: "20px" }}>Volver</button>
        </div>
    );
};

export default ExpedienteDetalle;
