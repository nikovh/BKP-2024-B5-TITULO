import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import '../styles/Registro.css'

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

function Registro() {
    const [rut, setRut] = useState("");
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [patenteProfesional, setPatenteProfesional] = useState("");
    const [errors, setErrors] = useState('');
    const navigate = useNavigate();

    // Limpia el formulario al cargar el componente
    useEffect(() => {
        setRut("");
        setNombres("");
        setApellidos("");
        setTelefono("");
        setEmail("");
        setPassword("");
        setPatenteProfesional("");
        setErrors("");
    }, []);

    //Validaciones 
    const validarRut = (value) => {
        if (/^[0-9]+-[0-9kK]{1}$/.test(value)) {
            return ""; // El RUT es válido
        }
        return "El RUT debe ser válido (formato: 12345678-9)."; 
    };
    const validarNombres = (value) => { 
        if (value.trim() !== "") {
            return ""; // El nombre es válido
        }
        return "El nombre es obligatorio."; 
    };
    
    const validarTelefono = (value) => {
        if (/^[0-9]{8,15}$/.test(value)) {
            return ""; // El teléfono es válido
        }
        return "Ingrese un teléfono válido (8-15 dígitos)."; 
    };
    
    const validarEmail = (value) => {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return ""; // El correo es válido
        }
        return "Ingrese un correo electrónico válido.";
    };

    const validarPassword = (value) => {
        if (value.length >= 6) {
            return ""; // La contraseña es válida
        }
        return "La contraseña debe tener al menos 6 caracteres.";
    };

    const handleRegistrar = async (e) => {
        e.preventDefault();
        const validationErrors = {};
    
        // Validar todos los campos requeridos
        validationErrors.rut = validarRut(rut);
        validationErrors.nombres = validarNombres(nombres);
        validationErrors.telefono = validarTelefono(telefono);
        validationErrors.email = validarEmail(email);
        validationErrors.password = validarPassword(password);

        // Filtrar errores que no estén vacíos
        const hasErrors = Object.values(validationErrors).some((error) => error !== "");
        setErrors(validationErrors);

        if (hasErrors) {
            return; // Detener el envío si hay errores
        }

        try {
            console.log("Registrando usuario con email:", email, "y password:", password);

            // Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            console.log("Usuario registrado en Firebase con UID:", userId);

            // guardar usuario en Firestore
            await setDoc(doc(firestore, "users", userId), {
                uid: userId,
                rut,
                nombres,
                apellidos: apellidos || null,
                telefono,
                email, 
                patenteProfesional: patenteProfesional || null,
                rol: "usuario",
                createdAt: new Date().toISOString(),
            });
            console.log("Usuario regisrado en Firestore correctamente");

            // Llamada al Backend
            // const response = await fetch("http://localhost:4000/usuarios", {
                const response = await fetch(`${API_URL}/usuarios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uid: userId,
                    rut,
                    nombres,
                    apellidos: apellidos || null,
                    telefono,
                    email,
                    password,
                    patenteProfesional: patenteProfesional || null,
                    rol: "usuario",
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error en el backend:", errorData);
                throw new Error(errorData.error || "Error al registrar usuario en el backend.");
            }

            console.log("Usuario registrado en el backend correctamente.");
            alert("Usuario creado exitosamente");
            navigate("/");
        } catch (err) {
            console.error("Error general:", err);
            setErrors((prev) => ({ ...prev, general: err.message || "Ocurrió un error al registrar el usuario." }));
        }
    };


    return (
        <div className="register-container">
            <h2>Regístrate</h2>
            <form onSubmit={handleRegistrar}>
                <div className="form-group">
                    <label htmlFor="rut">RUT</label>
                    <input
                        type="text"
                        id="rut"
                        value={rut}
                        onChange={(e) => setRut(e.target.value)}
                        required
                    />
                    {errors.rut && <p className="error">{errors.rut}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="nombres">Nombres</label>
                    <input
                        type="text"
                        id="nombres"
                        value={nombres}
                        onChange={(e) => setNombres(e.target.value)}
                        required
                    />
                    {errors.nombres && <p className="error">{errors.nombres}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="apellidos">Apellidos</label>
                    <input
                        type="text"
                        id="apellidos"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                        type="text"
                        id="telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                    />
                    {errors.telefono && <p className="error">{errors.telefono}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="patenteProfesional">Patente Profesional</label>
                    <input
                        type="text"
                        id="patenteProfesional"
                        value={patenteProfesional}
                        onChange={(e) => setPatenteProfesional(e.target.value)}
                    />
                </div>

                {errors.general && <p className="error">{errors.general}</p>}
                <button type="submit">Registrarse</button>
            </form>
            <p>
                ¿Ya tienes cuenta? Entonces <a href="/">Inicia sesión</a>.
            </p>
        </div>
    );
}

export default Registro;