import React, { useEffect, useState } from "react";
import { getExpedientesProtegidos } from "../api/expedientesApi";

function PruebaProtegida() { 
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        getExpedientesProtegidos()
            .then((data) => {
                setMensaje(data);
            })
            .catch((err) => {
                setMensaje(err.mensaje);
            });
    }, []);

    return (
        <div>
            <h1>Prueba de Ruta Protegida</h1>
            <p>{mensaje}</p>
        </div>
    );
}

export default PruebaProtegida;