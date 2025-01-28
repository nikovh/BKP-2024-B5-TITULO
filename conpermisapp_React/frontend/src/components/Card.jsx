import React from "react";
import { FaTrash } from "react-icons/fa";
import "../styles/Card.css";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale"


function Card({ expediente, onCreate, onClick, onDelete }) {
    if (!expediente) {
        return (
            <div className="expediente-card add-new" onClick={onCreate}>
                <div className="card-contenido">
                    <h1>+</h1>
                    <p>Crear un nuevo expediente</p>
                </div>
            </div>
        );
    }

    // Tiempo de creacion
    const tiempoCreacion = formatDistanceToNow(new Date(expediente.fechaCreacion), { 
        addSuffix: true, 
        locale: es 
    });
    
    
    // return (
    //     <div className="expediente-card" onClick={onClick}>
    //         <div>
    //             <h3>{expediente.descripcion}</h3>
    //         </div>
    //         <div>
    //             <p>Código: {expediente.subtipo}</p>
    //             <p>Creado {tiempoCreacion}</p>
    //         </div>
    //         <div className="expediente-card-icons">
    //             <FaTrash
    //                 className="icon delete-icon"
    //                 onClick={(e) => {
    //                     e.stopPropagation(); // Evitar conflicto con onClick general
    //                     onDelete(expediente.id);
    //                 }}
    //             />
    //         </div>
    //     </div>
    // );

    return (
        <div className="expediente-card" onClick={onClick}>
          {/* Encabezado */}
          <div className="expediente-card-header">
            <span>ID: {expediente.id}</span>
            <FaTrash
              className="expediente-card-icons"
              onClick={(e) => {
                e.stopPropagation(); // Prevenir conflicto con el click general
                onDelete(expediente.id);
              }}
            />
          </div>
    
          {/* Texto central */}
          <h3>{expediente.descripcion}</h3>
    
          {/* Texto inferior */}
          <div className="expediente-card-footer">
            <p>Código: {expediente.subtipo}</p>
            <p>Creado {tiempoCreacion}</p>
          </div>
        </div>
      );

}


export default Card;
