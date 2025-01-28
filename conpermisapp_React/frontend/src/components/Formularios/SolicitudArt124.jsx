import React, { useState, useEffect } from "react";
import GenerarPDF from "../GenerarPDF";
import { useParams } from "react-router-dom";


const SolicitudArt124 = () => {
  const { id } = useParams();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const fileName = `conPermisApp_formulario_${id}.pdf`;

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        if (!id) throw new Error("El ID del expediente no está definido.");

        // Fetch expediente, propiedad y propietario en una sola llamada
        const response = await fetch(`http://localhost:4000/expedientes/${id}/detalle`);
        if (!response.ok) throw new Error("No se pudieron cargar los datos del expediente.");
        const data = await response.json();

        // Validación de los datos recibidos
        if (!data.expediente || !data.propietario || !data.propiedad) {
          throw new Error("Datos incompletos del expediente.");
        }

        setDatos(data); // Almacena los datos obtenidos
      } catch (err) {
        console.error("Error al obtener los datos del expediente:", err);
        setError(err.message);
      }
    };

    fetchDatos();
  }, [id]);

  // Mostrar mensaje de error
  if (error) {
    return <p style={{ color: "red" }}>Error al cargar los datos: {error}</p>;
  }

  if (!datos) {
    return <p style={{ textAlign: "center" }}>Cargando datos del expediente...</p>;
  }

  const { propietario, propiedad } = datos;

  // Validar que propiedad y propietario estén presentes
  if (!propietario || !propiedad) {
    return <p style={{ textAlign: "center" }}>Datos incompletos. Verifique el expediente.</p>;
  }

  return (
    <GenerarPDF filename={fileName}>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h3 style={{ textAlign: "center", textDecoration: "underline" }}>
          SOLICITUD PARA ACOGERSE AL ART. 124º DE LA L.G.U.C.
        </h3>

        <p style={{ marginTop: "40px" }}>
          DE: <strong>{`${propietario.nombres} ${propietario.apellidos}`}</strong>
        </p>
        <p>PARA: <strong>Sr. Director de Obras Municipales de {propiedad.comuna}</strong></p>

        <p style={{ marginTop: "20px" }}>
          Sr. Director de Obras, solicito a usted acoger a autorización transitoria según art. 124º de
          la Ley General de Urbanismo y Construcciones, la propiedad ubicada en{" "}
          <strong>{`${propiedad.direccion} ${propiedad.numero}`}</strong>, de esta comuna.
        </p>

        <p>
          La parte de la edificación para la cual se solicita dicha autorización provisoria corresponde
          a la superficie que se encuentra en área de antejardín, producto del ensanche realizado en
          av. <strong>{propiedad.direccion}</strong> y que afecta el proceso de autorización del
          presente expediente de Permiso de Edificación, en una superficie total de{" "}
          <strong>{propiedad.m2} m²</strong>.
        </p>

        <p>Esperando tener a bien mi solicitud, saluda respetuosamente,</p>

        <p style={{ marginTop: "60px" }}>
          <strong>{`${propietario.nombres} ${propietario.apellidos}`}</strong>
        </p>
        <p><strong>{propietario.rut}</strong></p>
      </div>
    </GenerarPDF>
  );
};

export default SolicitudArt124;