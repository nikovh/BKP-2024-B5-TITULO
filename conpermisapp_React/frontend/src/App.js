import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Registro from './components/Registro';
import Dashboard from './components/Dashboard';
import AccesoProtegido from './components/AccesoProtegido';
import ExpedienteDetalle from "./components/ExpedienteDetalle";
import ExpedienteManager from "./components/ExpedienteManager";
import ExpedienteFormPage from "./components/ExpedienteFormPage";
import Administracion from "./components/Administracion";


import SolicitudArt124 from "./components/Formularios/SolicitudArt124";
import FormDeclaracionProp from "./components/Formularios/FormDeclaracionProp";
import EditarElemento from "./components/EditarElemento";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route 
          path="/dashboard" 
          element={ 
            <AccesoProtegido allowedRoles={["usuario"]}>
               <Dashboard /> 
            </AccesoProtegido> 
          }
        />
        <Route
          path="/administracion"
          element={
            <AccesoProtegido allowedRoles={["admin"]}>
              <Administracion />
            </AccesoProtegido>
          }
        />
        <Route path="/expediente-form" element={<ExpedienteFormPage />} />
        <Route path="/expedientes" element={<ExpedienteManager />} />
        
        {/* rutas con parametros */}
        <Route path="/expedientes/:email" element={<ExpedienteManager />} />
        <Route path="/detalle/:id" element={<ExpedienteDetalle />} />
        <Route path="/editar/:id" element={<EditarElemento/>} />
        
        <Route path="/124/:expedienteId" element={<SolicitudArt124 />} />
        <Route path="/declaracion-prop/:expedienteId" element={<FormDeclaracionProp />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
