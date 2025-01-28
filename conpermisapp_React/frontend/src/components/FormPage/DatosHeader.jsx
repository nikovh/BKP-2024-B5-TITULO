import React from "react";
import useFetchDatos from "../hooks/useFetchDatos";

const DatosHeader = ({ expedienteId }) => {
    const { datos, error } = useFetchDatos(expedienteId);

    if (error) {
        return <p>Error al cargar los datos: {error}</p>;
    }

    if (
        !datos.expediente ||
        !datos.propiedad ||
        !datos.propietario ||
        !datos.usuario ||
        !datos.tipoExpediente ||
        !datos.subTipoExpediente
    ) {
        return <p>Cargando datos...</p>;
    }

    // Datos 
    const {
        propiedad = {},
        propietario = {},
        expediente = {},
        usuario = {},
        tipoExpediente = {},
        subTipoExpediente = {},
    } = datos;


    return (
        <div style={{ padding: "20px", fontFamily: "Century Gothic" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                <tbody>
                    <tr>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}><strong>OBRA:</strong></td>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                            {tipoExpediente.nombre || "Tipo no especificado"} – {subTipoExpediente.nombre || "Subtipo no especificado"}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}><strong>UBICACIÓN:</strong></td>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                            {`${propiedad.direccion || ""} ${propiedad.numero || ""}`.trim() || "Sin dirección"}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}><strong>COMUNA:</strong></td>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                            {propiedad.comuna || "Sin comuna"}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}><strong>ROL:</strong></td>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                            {propiedad.rolSII || "Sin ROL"}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}><strong>PROPIETARIO:</strong></td>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                            {`${propietario.nombres || ""} ${propietario.apellidos || ""}`.trim() || "Sin propietario"}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}><strong>ARQUITECTO:</strong></td>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                            {`${usuario.nombres || ""} ${usuario.apellidos || ""}`.trim() || "Sin arquitecto"}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default DatosHeader;