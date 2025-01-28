import React, { useState } from "react";
import useFetchDatos from "../hooks/useFetchDatos";
import FormularioModal from "./FormularioModal";
import GenerarPDF from "../GenerarPDF";

const Formulario1 = ({ expedienteId }) => {
  const { datos } = useFetchDatos(expedienteId); // Hook para obtener datos.
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!datos || !datos.expediente || !datos.propiedad || !datos.propietario || !datos.usuario) {
    return <p>Cargando datos del formulario...</p>; // Manejo básico de estado.
  }

  // Abrir modal para la vista previa.
  const handleVistaPrevia = () => {
    setIsModalOpen(true);
  };

  const handleCerrarModal = () => {
    setIsModalOpen(false);
  };

  const handleImprimir = () => {
    GenerarPDF({ ...datos });
  };

  return (
    <GenerarPDF>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1>Formulario 1</h1>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>Campo</th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {/* Datos del expediente */}
            <tr>
              <td>Expediente ID</td>
              <td>{datos.expediente.expedienteId}</td>
            </tr>
            <tr>
              <td>Descripción</td>
              <td>{datos.expediente.descripcion}</td>
            </tr>
            {/* Datos del propietario */}
            <tr>
              <td>Propietario Nombre</td>
              <td>{datos.propietario.nombres} {datos.propietario.apellidos}</td>
            </tr>
            <tr>
              <td>Propietario RUT</td>
              <td>{datos.propietario.rut}</td>
            </tr>
            {/* Datos de la propiedad */}
            <tr>
              <td>Propiedad Dirección</td>
              <td>{datos.propiedad.direccion}</td>
            </tr>
            <tr>
              <td>Rol SII</td>
              <td>{datos.propiedad.rolSII}</td>
            </tr>
          </tbody>
        </table>

        {/* Botones */}
        <div>
          <button onClick={handleVistaPrevia} style={{ marginRight: "10px" }}>Vista Previa</button>
          <button onClick={handleImprimir}>Imprimir</button>
        </div>

        {/* Modal para Vista Previa */}
        {isModalOpen && (
          <FormularioModal onClose={handleCerrarModal}>
            <h2>Vista Previa del Formulario</h2>
            <p>
              La solicitud correspondiente al expediente ID {datos.expediente.expedienteId} con descripción "
              {datos.expediente.descripcion}" pertenece al propietario {datos.propietario.nombres}{" "}
              {datos.propietario.apellidos}, con RUT {datos.propietario.rut}, y hace referencia a la propiedad ubicada
              en {datos.propiedad.direccion}, Rol SII: {datos.propiedad.rolSII}.
            </p>
            <button onClick={handleCerrarModal}>Cerrar</button>
          </FormularioModal>
        )}
      </div>
    </GenerarPDF>

  );
};

export default Formulario1;
