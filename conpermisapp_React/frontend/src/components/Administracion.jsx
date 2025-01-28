import React, { useState, useEffect } from "react";
import Desplegable from "./FormPage/Desplegable";
import FormularioModal from "./Formularios/FormularioModal";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/Administracion.css";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";


const Administracion = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [data, setData] = useState({
    usuarios: [],
    propietarios: [],
    propiedades: [],
    expedientes: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usuariosRes, propietariosRes, propiedadesRes, expedientesRes] = await Promise.all([
          fetch(`${API_URL}/usuarios`).then((res) => res.json()),
          fetch(`${API_URL}/propietarios`).then((res) => res.json()),
          fetch(`${API_URL}/propiedades`).then((res) => res.json()),
          fetch(`${API_URL}/expedientes`).then((res) => res.json()),
        ]);

        setData({
          usuarios: usuariosRes,
          propietarios: propietariosRes,
          propiedades: propiedadesRes,
          expedientes: expedientesRes,
        });
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  const openModal = (type) => {
    setActiveModal(type);
    setFilter("");          // Resetear el filtro
    setFilteredData([]);    // Limpiar resultados anteriores
    setError(null);         // Limpiar errores
    setEditingItem(null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setFilteredData([]);
    setEditingItem(null);
  };

  const handleFilterSearch = async () => {
    console.log("handleFilterSearch fue llamado");
    setHasSearched(true); // Marcar que se hizo una búsqueda
    try {
      let endpoint = `${API_URL}/${activeModal}`;
      let query = "";

      // Construir la consulta dependiendo del tipo de Card
      if (activeModal === "propiedades") {
        query = `?expedienteId=${filter}`; // Buscar en propiedades por expedienteId
      } else if (activeModal === "expedientes") {
        endpoint += `/${filter}`;
      } else if (activeModal === "usuarios" || activeModal === "propietarios") {
        query = `?rut=${filter}`; // Buscar por RUT en otros casos
      }

      // Realizar la solicitud al backend
      const response = await fetch(`${endpoint}${query}`);
      if (!response.ok) {
        throw new Error("Error al buscar datos. Verifica el filtro ingresado.");
      }
      const data = await response.json();

      // Manejo de datos según el tipo de Card
      if (activeModal === "propiedades") {
        setFilteredData(data.length > 0 ? [data[0]] : []); // Devuelve solo el primer registro para propiedades
      } else {
        setFilteredData(Array.isArray(data) ? data : [data]); // Formato array para otros casos
      }

      setError(null);         // Limpiar errores
    } catch (err) {
      setFilteredData([]);    // Limpiar datos en caso de error
      setError(err.message);  // Establecer mensaje de error
    }
  };

  const handleDelete = async (idOrRut, type = null) => {
    console.log("Valor enviado a DELETE:", idOrRut);
    const confirmDelete = window.confirm(
      `¿Está seguro de que desea eliminar este registro?`
    );
    if (!confirmDelete) return;

    try {
      const currentType = type || activeModal; // Determinar si es modal o desplegable
      const endpoint = currentType === "usuarios" || currentType === "propietarios" ? "rut" : "id";
      const response = await fetch(`${API_URL}/${currentType}/${idOrRut}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el registro.");
      }

      setData((prev) => ({
        ...prev,
        [currentType]: prev[currentType].filter(
          (item) => item.rut !== idOrRut && item.id !== idOrRut
        ),
      }));

      // Si estamos en el modal, también actualizamos los datos filtrados
      if (currentType === activeModal) {
        setFilteredData((prev) =>
          prev.filter((item) => item.rut !== idOrRut && item.id !== idOrRut)
        );
      }

      alert("Registro eliminado exitosamente.");
    } catch (err) {
      alert("Ocurrió un error al intentar eliminar el registro.");
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    const idOrRut = item.id || item.rut || item.Expediente_id;
    if (!idOrRut) {
      alert("No se puede editar este registro porque no tiene un identificador válido.");
      return;
    }
    navigate(`/editar/${idOrRut}`); // Redirige usando el ID del elemento
  };

  const renderTable = (type) => (
    <table className="data-table">
      <thead>
        <tr>
          {Object.keys(data[type][0] || {}).map((key) => (
            <th key={key}>{key}</th>
          ))}
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data[type].map((item, index) => (
          <tr key={index}>
            {Object.values(item).map((value, idx) => (
              <td key={idx}>{value}</td>
            ))}
            <td>
              <button onClick={() => handleEdit(item)}>Editar</button>
              <button onClick={() => handleDelete(item.rut || item.id, type)}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <div className="administracion-container">
      <div className="dashboard-header">
        <h1>Administración</h1>
        <button onClick={handleLogout} className="cerrarButton">
          Cerrar Sesión
        </button>
      </div>


      <div className="cards-container">
        {[
          { label: "Arquitecto", type: "usuarios" },
          { label: "Propietario", type: "propietarios" },
          { label: "Propiedad", type: "propiedades" },
          { label: "Expediente", type: "expedientes" },
        ].map(({ label, type }) => (
          <div className="card" key={type} onClick={() => openModal(type)}>
            <h2>+ {label}</h2>
            <p>Editar</p>
          </div>
        ))}
      </div>

      {[
        { title: "Lista de Arquitectos", type: "usuarios" },
        { title: "Lista de Propietarios", type: "propietarios" },
        { title: "Lista de Propiedades", type: "propiedades" },
        { title: "Lista de Expedientes", type: "expedientes" },
      ].map(({ title, type }) => (
        <Desplegable key={type} title={title} defaultExpanded={false}>
          {renderTable(type)}
        </Desplegable>
      ))}

      {activeModal && (
        <FormularioModal onClose={closeModal}>
          <div className="modal-container">
            <h2>Editando {activeModal === "propiedades" ? "Propiedad" : activeModal}</h2>

            {/* Campo para buscar registros */}
            {!editingItem && (
              <>
                <label>
                  {activeModal === "usuarios" || activeModal === "propietarios"
                    ? "Ingrese el RUT:"
                    : "Ingrese el ID:"}
                </label>
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder={`Ejemplo: ${activeModal === "usuarios" || activeModal === "propietarios"
                      ? "12345678-9"
                      : "1001"
                    }`}
                />
                <button onClick={handleFilterSearch}>Buscar</button>

                {/* Mostrar error si ocurre */}
                {error && <p style={{ color: "red" }}>{error}</p>}
              </>
            )}

            {/* Mostrar formulario de edición si está en modo edición */}
            {editingItem ? (
              <div className="form-container">
                {Object.keys(editingItem).map((key) => (
                  <div key={key} className="form-group">
                    <label>{key}</label>
                    <input
                      type="text"
                      value={editingItem[key]}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, [key]: e.target.value })
                      }
                    />
                  </div>
                ))}
                <button onClick={() => setEditingItem(null)}>Cancelar</button>
              </div>
            ) : (
              // Mostrar tabla con registros si no está en modo edición
              <div className="data-table-container">
                {filteredData.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        {Object.keys(filteredData[0]).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, index) => (
                        <tr key={index}>
                          {Object.values(item).map((value, idx) => (
                            <td key={idx}>{value}</td>
                          ))}
                          <td>
                            <button onClick={() => handleEdit(item)}>Editar</button>
                            <button onClick={() => handleDelete(item.rut || item.id)}>
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : hasSearched ? (
                  <p>No se encontraron registros.</p>
                ) : null}
              </div>
            )}
          </div>
        </FormularioModal>
      )}
    </div>
  );
};

export default Administracion;