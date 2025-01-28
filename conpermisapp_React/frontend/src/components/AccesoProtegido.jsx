import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "../firebase";

const db = getFirestore();

function AccesoProtegido({ children, allowedRoles = [] }) {
    const [usuarioRegistrado, loadingAuth] = useAuthState(auth);
    const [userRole, setUserRole] = React.useState(null);
    const [loadingRole, setLoadingRole] = React.useState(true);

    //     React.useEffect(() => {
    //         const fetchUserRole = async () => {
    //             if(usuarioRegistrado) {
    //                 const userDoc = await getDoc(doc(db, "users", usuarioRegistrado.uid));
    //                 if (userDoc.exists()) {
    //                     setUserRole(userDoc.data().rol);
    //                 }
    //             }
    //         };
    //         fetchUserRole();
    //     }, [usuarioRegistrado]);

    //     return allowedRoles.includes(userRole) ? children : <Navigate to="/" />;
    // }

    React.useEffect(() => {
        const fetchUserRole = async () => {
            if (usuarioRegistrado) {
                try {
                    const userDoc = await getDoc(doc(db, "users", usuarioRegistrado.uid));
                    if (userDoc.exists()) {
                        setUserRole(userDoc.data().rol);
                    } else {
                        console.error("No se encontró el documento del usuario en Firestore.");
                    }
                } catch (err) {
                    console.error("Error al obtener el rol del usuario:", err);
                }
            }
            setLoadingRole(false);
        };

        fetchUserRole();
    }, [usuarioRegistrado]);

    // Mostrar un estado de carga mientras se valida la sesión o el rol
    if (loadingAuth || loadingRole) {
        return <p>Cargando...</p>;
    }

    // Redirigir si el usuario no está autenticado o no tiene el rol permitido
    if (!usuarioRegistrado || !allowedRoles.includes(userRole)) {
        return <Navigate to="/" />;
    }

    // Renderizar los hijos si el rol está permitido
    return children;
}

export default AccesoProtegido;