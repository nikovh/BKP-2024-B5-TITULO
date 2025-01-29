import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import '../styles/Login.css';

// const db = getFirestore();

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError("El correo electrónico no es válido.");
            setLoading(false);
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;
            console.log("Usuario autenticado:", userCredential);

            // Obtener el rol desde Firestore
            const userDocRef = doc(firestore, "users", userId);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                console.log("Datos del usuario:", userData);

                // Redirigir según el rol
                if (userData.rol === "admin") {
                    navigate("/administracion");
                } else if (userData.rol === "usuario") {
                    navigate("/dashboard");
                } else {
                    setError("Rol desconocido. Contacte al administrador.");
                }
            } else {
                setError("Usuario no registrado en Firestore.");
            }
        } catch (err) {
            setError("Correo electrónico o contraseña incorrectos.");
            console.error("Error al iniciar sesión:", err.message);
        }
    };

    return (
        <div className="login-background">
            <div className="background-text">conPermisApp</div>
            <div className="login-box">
                <h2>Inicia sesión a tu cuenta</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Contraseña">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit" className="login-button"> Iniciar sesión</button>
                </form>
                <p>¿No tienes cuenta? No hay problema, <Link to="/registro">Regístrate aquí</a>.</p>
            </div>
        </div>
    );


}

export default Login;