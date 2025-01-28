import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Modal.css"

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

function ExpedienteModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [tipos, setTipos] = useState([]);
    const [subtipos, setSubtipos] = useState([]);
    const [tipoSeleccionado, setTipoSeleccionado] = useState('');
    const [subtipoSeleccionado, setSubtipoSeleccionado] = useState('');
    const [subtipoFiltrado, setSubtipoFiltrado] = useState([]); // para hacer un filtro dinámico



    useEffect(() => {
        if (isOpen) {
            // consultar tipos y subtipos
            fetch(`${API_URL}/expedientes/tipo-expediente`)
                .then((res) => res.json())
                .then((data) => setTipos(data))
                .catch((err) => console.error(err));

            fetch(`${API_URL}/expedientes/subtipo-expediente`)
                .then((res) => res.json())
                .then((data) => setSubtipos(data))
                .catch((err) => console.error(err));
        }
    }, [isOpen]);


    // filtrar subtipos en funcion del tipo
    useEffect(() => {
        if (tipoSeleccionado) {
            setSubtipoFiltrado(
                subtipos.filter((subtipo) => subtipo.id.startsWith(tipoSeleccionado))
            );
        } else {
            setSubtipoFiltrado([]);
        }
    }, [tipoSeleccionado, subtipos]);

    // Manejar la creación del expediente y redirigir
    const handleCreate = () => {
        if (!tipoSeleccionado || !subtipoSeleccionado) {
            alert("Debes seleccionar el tipo de expediente y el subtipo.");
            return;
        }

        //crear expediente
        // navigate(`/expediente?tipo=${tipoSeleccionado}&subtipo=${subtipoSeleccionado}`);
        // Redirigir con parámetros tipo y subtipo
        navigate(`/expediente-form?tipo=${tipoSeleccionado}&subtipo=${subtipoSeleccionado}`);
        onClose();  // cerrar modal
    };

    if (!isOpen) return null;


    return (
        <div className="modal-overlay">
            <div className="modal-contenido">
                <h2>Crear Nuevo Expediente</h2>

                <div className="campos-horizontal">
                    <div>
                        <label>Tipo</label>
                        <select value={tipoSeleccionado} onChange={(e) => setTipoSeleccionado(e.target.value)}>
                            <option value="">Seleccione el tipo de expediente</option>
                            {tipos.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Subtipo</label>
                        <select value={subtipoSeleccionado} onChange={(e) => setSubtipoSeleccionado(e.target.value)} disabled={!subtipoFiltrado.length} >
                            <option value="">Seleccione un subtipo</option>
                            {subtipoFiltrado.map((subtipo) => (
                                <option key={subtipo.id} value={subtipo.id}>
                                    {subtipo.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>


                <div className="botones-modal">
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={handleCreate}>Crear Expediente</button>
                </div>

            </div>
        </div>
    );

}


export default ExpedienteModal;