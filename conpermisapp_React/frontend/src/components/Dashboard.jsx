import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import ExpedienteModal from "./ExpedienteModal";
import Card from "./Card"
import '../styles/Dashboard.css'


function Dashboard() {
    const [user] = useAuthState(auth);
    const [nombreUsuario, setNombreUsuario] = useState("Usuario general");
    const [expedientes, setExpedientes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
 
        const fetchData = async () => {
            try {
                const email = user.email;
    
                // Solicitud para obtener el usuario
                const userResponse = await fetch(`http://localhost:4000/usuarios?email=${email}`);
                if (!userResponse.ok) throw new Error("No se encontró el usuario en la base de datos.");
                const userData = await userResponse.json();
                console.log(userData)
                
                setNombreUsuario(userData.nombres); // Actualizar el nombre del usuario
    
                // Solicitud para obtener los expedientes
                const expedientesResponse = await fetch(`http://localhost:4000/expedientes?usuario_email=${email}`);
                if (!expedientesResponse.ok) throw new Error("Error al cargar expedientes.");
                const expedientesData = await expedientesResponse.json();
    
                if (!Array.isArray(expedientesData)) {
                    console.error("El backend no devolvió un array:", expedientesData);
                    setExpedientes([]);
                    return;
                }
    
                // Ordenar los expedientes
                const ordenDesc = expedientesData.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
                setExpedientes(ordenDesc);
            } catch (err) {
                console.error(err.message);
                setNombreUsuario("Usuario no encontrado");
                setExpedientes([]); // Asegúrate de que los expedientes se vacíen en caso de error
            }
        };
    
        fetchData();
    }, [user, navigate]);

    const crearExpediente = async (tipo, subtipo, propietario) => {

        try {
            //verificar si el propietario existe
            const propietarioExiste = await fetch(`http://localhost:4000/propietarios/${propietario.rut}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Error al verificar el propietario");
                    }
                    return res.json();
                })
                .catch((err) => {
                    console.error("Error al verificar el propietario:", err);
                    return null; // Propietario no encontrado
                });

            // crear al propietario si no existe
            if (!propietarioExiste) {
                const crearPropietarioResp = await fetch(`http://localhost:4000/propietarios`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        rut: propietario.rut,
                        nombres: propietario.nombres,
                        apellidos: propietario.apellidos || null,
                        email: propietario.email || null,
                        telefono: propietario.telefono || null,
                    }),
                });

                if (!crearPropietarioResp.ok) {
                    throw new Error("Error al crear el propietario");
                }
            }

            // crear expediente
            const resp = await fetch("http://localhost:4000/expedientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    descripcion: `Nuevo expediente de ${tipo}`,
                    tipo,
                    subtipo,
                    propietario: {
                        rut: propietario.rut,
                    },
                    usuarioEmail: user.email,
                    EstadoExpediente_id: 1,
                }),
            });
            if (resp.ok) {
                const newExpedientes = await fetch(`http://localhost:4000/expedientes?usuario_email=${user.email}`)
                    .then((res) => res.json());
                setExpedientes(newExpedientes);
            } else {
                alert("Error al crear el expediente");
            }
        } catch (err) {
            console.error("Error", err);
            alert("Error al crear un nuevo expediente");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (err) {
            console.error("Error al cerrar sesión:", err);
        }
    };

    const abrirDetalleExpediente = (id) => {
        navigate(`/detalle/${id}`);
    };


    // const handleEditExpediente = (id) => {
    //     // Navegar a una pantalla de edición o abrir un modal con el expediente seleccionado
    //     console.log(`Editar expediente con ID: ${id}`);
    //     navigate(`/editar-expediente/${id}`);
    // };

    const handleDeleteExpediente = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este expediente?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:4000/expedientes/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Expediente eliminado exitosamente");
                setExpedientes((prevExpedientes) => prevExpedientes.filter((exp) => exp.id !== id));
            } else {
                console.error("Error al eliminar el expediente");
                alert("Ocurrió un error al eliminar el expediente");
            }
        } catch (err) {
            console.error("Error al eliminar el expediente:", err);
            alert("Error al eliminar el expediente");
        }
    };

    return (
        <div className="dashboard">
            {/* Encabezado del Dashboard */}
            <div className="dashboard-header">
                <h1>Bienvenido {nombreUsuario}</h1>
                <button onClick={handleLogout} className="cerrarButton">
                    Cerrar Sesión
                </button>
            </div>
    
            {/* Contenido del Dashboard */}
            <h2>Mis Expedientes</h2>
            <div className="expedientes-container">
                {/* Tarjeta para crear un nuevo expediente */}
                <Card expediente={null} onCreate={() => setIsModalOpen(true)} />
                {/* Mostrar los expedientes existentes */}
                {expedientes.length === 0 ? ("") : (
                    expedientes.map((expediente) => (
                        <Card
                            key={expediente.id}
                            expediente={expediente}
                            onClick={() => abrirDetalleExpediente(expediente.id)}
                            // onEdit={handleEditExpediente}
                            onDelete={handleDeleteExpediente}
                        />
                    ))
                )}
            </div>
    
            <ExpedienteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={crearExpediente}
            />
        </div>
    );

}

export default Dashboard;