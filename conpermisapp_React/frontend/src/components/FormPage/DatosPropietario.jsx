import React, { useState, useEffect } from 'react';

const DatosPropietario = ({ propietario, onSave }) => {
  const [propData, setPropData] = useState({
    rut: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
  });

  const [errores, setErrores] = useState({});
  const [isEditing, setIsEditing] = useState(false); // Modo de edición

  useEffect(() => {
    if (propietario) {
      setPropData({
        rut: propietario.rut || '',
        nombres: propietario.nombres || '',
        apellidos: propietario.apellidos || '',
        email: propietario.email || '',
        telefono: propietario.telefono || '',
      });
    }
  }, [propietario]);

  // Validaciones
  const validarCampos = (data) => {
    const nuevosErrores = {};
    if (!data.rut.match(/^[0-9]{7,8}-[0-9kK]{1}$/)) {
      nuevosErrores.rut = "El RUT debe ser válido (Ej: 12345678-9).";
    }
    if (!data.nombres.trim()) {
      nuevosErrores.nombres = "El nombre es obligatorio.";
    }
    if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      nuevosErrores.email = "El correo electrónico debe ser válido.";
    }
    if (!String(data.telefono).match(/^[0-9]{8,15}$/)) {
      nuevosErrores.telefono = "El teléfono debe tener entre 8 y 15 dígitos.";
    }
    return nuevosErrores;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropData((prev) => ({ ...prev, [name]: value }));

    // Validación en tiempo real
    const nuevosErrores = validarCampos({ ...propData, [name]: value });
    setErrores(nuevosErrores);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar todos los campos
    const nuevosErrores = validarCampos(propData);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      onSave(propData); // solo guarda si nuevosErorres son 0
      setIsEditing(false);
    }
  };

  if (!propietario) {
    return <p>Cargando datos del propietario...</p>;
  }


  return (
    <div>
      <form onSubmit={handleSubmit}>
        {[
          { label: "RUT", name: "rut" },
          { label: "Nombres", name: "nombres" },
          { label: "Apellidos", name: "apellidos" },
          { label: "Email", name: "email", type: "email" },
          { label: "Teléfono", name: "telefono", type: "number" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name} style={{ marginBottom: "10px" }}>
            <label>{label}:</label>
            <input
              type={type}
              name={name}
              value={propData[name]}
              onChange={handleChange}
              disabled={!isEditing} // Desactiva los campos si no está en modo edición
            />
          </div>
        ))}
        <div>
          {!isEditing ? (
            <button type="button" onClick={() => setIsEditing(true)} style={{ marginRight: "10px" }}>
              Editar
            </button>
          ) : (
            <>
              <button type="submit" style={{ marginRight: "10px" }}>Guardar</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default DatosPropietario;
