import React, { useState } from 'react';
import "../../styles/formularios.css";

function CargaOcupacionForm() {
  const [recintos, setRecintos] = useState([
    { nivel: '', nombre: '', supM2: '', persPorM2: '', cargaOcupacion: '' }
  ]);

  // Agregar una fila nueva
  const agregarRecinto = () => {
    setRecintos([
      ...recintos,
      { nivel: '', nombre: '', supM2: '', persPorM2: '', cargaOcupacion: '' }
    ]);
  };

  // Eliminar una fila específica
  const eliminarRecinto = (index) => {
    const nuevosRecintos = recintos.filter((_, i) => i !== index);
    setRecintos(nuevosRecintos);
  };

  // Manejar cambios en los inputs
  const manejarCambio = (index, e) => {
    const { name, value } = e.target;
    const nuevosRecintos = [...recintos];
    nuevosRecintos[index][name] = value;
    if (name === 'supM2' || name === 'persPorM2') {
      nuevosRecintos[index]['cargaOcupacion'] =
        nuevosRecintos[index]['supM2'] && nuevosRecintos[index]['persPorM2']
          ? (parseFloat(nuevosRecintos[index]['supM2']) /
              parseFloat(nuevosRecintos[index]['persPorM2'])
            ).toFixed(2)
          : '';
    }
    setRecintos(nuevosRecintos);
  };

  return (
    <div className="container">
      <h2>Cálculo de Carga de Ocupación</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Nivel</th>
            <th>Nombre Recinto</th>
            <th>Sup. M²</th>
            <th>Pers. por M²</th>
            <th>Carga de Ocupación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {recintos.map((recinto, index) => (
            <tr key={index}>
              <td><input type="text" name="nivel" /></td>
              <td><input type="text" name="nombre" /></td>
              <td><input type="number" name="supM2" /></td>
              <td><input type="number" name="persPorM2" /></td>
              <td>{recinto.cargaOcupacion}</td>
              <td><button onClick={() => eliminarRecinto(index)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="button" onClick={agregarRecinto}>Agregar Recinto</button>
    </div>
  );
}

export default CargaOcupacionForm;
