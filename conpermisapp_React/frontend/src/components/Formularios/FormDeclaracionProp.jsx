import React, { useState, useEffect } from "react";
import GenerarPDF from "../GenerarPDF";
import { useParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

const FormDeclaracionProp = () => {
  const { id } = useParams();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const fileName = `conPermisApp_declaracion_${id}.pdf`;

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
          DECLARACIÓN SIMPLE DE DOMINIO DEL INMUEBLE
        </h3>

        <p style={{ marginTop: "40px" }}>
          Yo, <strong>{`${propietario.nombres} ${propietario.apellidos}`}</strong>, RUT <strong>{propietario.rut}</strong>,
          declaro ser dueño del bien raíz ubicado en calle <strong>{`${propiedad.direccion} N°${propiedad.numero}`} </strong> 
          de la comuna de <strong>{propiedad.comuna}</strong>, que se encuentra inscrita a mi nombre a Fojas
          <strong> {propiedad.inscFojas}</strong> N°<strong>{propiedad.inscNumero}</strong> del año
          <strong> {propiedad.inscYear}</strong> del Conservador de Bienes Raíces, en el cual se encuentra el inmueble para el cual se solicita el
          <strong> Permiso de Edificación</strong> del presente expediente.
        </p>

        <p style={{ marginTop: "300px", textAlign: "center" }}>
          <strong>{`${propietario.nombres} ${propietario.apellidos}`}</strong>
        </p>
        <p style={{ textAlign: "center" }}>
          <strong>{propietario.rut}</strong>
        </p>
        <p style={{ textAlign: "center" }}>
          Propietario
        </p>
      </div>
    </GenerarPDF>
  );
};

export default FormDeclaracionProp;
