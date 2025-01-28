import React from "react";
import "../../styles/Modal.css";
 
const FormularioModal = ({ onClose, children }) => {
    return (
        <div className="modal-overlay">
      <div className="modal-contenido">
        {children}
        <button className="modal-close" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default FormularioModal;
