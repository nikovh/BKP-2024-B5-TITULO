import React, { useState, useEffect } from "react";

const ArquitectoPatrocinante = ({ usuario, onUpdate }) => {
    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        rut: "",
        telefono: "",
        email: "",
        patenteProfesional: "",
    });

    // Inicializar datos desde el usuario cuando esté disponible
    useEffect(() => {
        if (usuario) {
            setFormData({
                nombres: usuario.nombres || "",
                apellidos: usuario.apellidos || "",
                rut: usuario.rut || "",
                telefono: usuario.telefono || "",
                email: usuario.email || "",
                patenteProfesional: usuario.patenteProfesional || "",
            });
        }
    }, [usuario]);

    // Manejar cambios en los campos
    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...formData, [name]: value };
        setFormData(updatedData);
        onUpdate(updatedData); // Notifica al componente padre
    };

    return (
        <div style={{ marginBottom: "20px" }}>
            {/* <h3>Arquitecto Patrocinante</h3> */}
            <form>
                <div>
                    <label>Nombres:</label>
                    <input
                        type="text"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div>
                    <label>Apellidos:</label>
                    <input
                        type="text"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div>
                    <label>RUT:</label>
                    <input
                        type="text"
                        name="rut"
                        value={formData.rut}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div>
                    <label>Teléfono:</label>
                    <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div>
                    <label>Patente Profesional:</label>
                    <input
                        type="text"
                        name="patenteProfesional"
                        value={formData.patenteProfesional}
                        onChange={handleChange}
                        disabled
                    />
                </div>
            </form>
        </div>
    );
};

export default ArquitectoPatrocinante;
