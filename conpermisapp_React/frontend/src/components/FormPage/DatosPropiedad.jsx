import React, { useState, useEffect } from "react";

const DatosPropiedad = ({ propiedad, onSave }) => {
    const [formData, setFormData] = useState({
        rolSII: '',
        direccion: '',
        numero: '',
        comuna: '',
        region: '',
        inscFojas: '',
        inscNumero: '',
        inscYear: '',
        numPisos: '',
        m2: '',
        destino: '',
    });
    // Si no hay datos en `propiedad`, la edición debe estar activa
    const [isEditing, setIsEditing] = useState(!propiedad);
    const [errores, setErrores] = useState({});
    const [errorBackend, setErrorBackend] = useState("");

    // datos iniciales
    useEffect(() => {
        if (propiedad) {
            setFormData({
                rolSII: propiedad.rolSII || '',
                direccion: propiedad.direccion || '',
                numero: propiedad.numero || '',
                comuna: propiedad.comuna || '',
                region: propiedad.region || '',
                inscFojas: propiedad.inscFojas || '',
                inscNumero: propiedad.inscNumero || '',
                inscYear: propiedad.inscYear || '',
                numPisos: propiedad.numPisos || '',
                m2: propiedad.m2 || '',
                destino: propiedad.destino || '',
            });
            setIsEditing(false); // Si hay datos, inicia bloqueado
        }
    }, [propiedad]);

    // Validar campos del formulario
    const validarCampos = (data) => {
        const errores = {};

        if (!data.rolSII) {
            errores.rolSII = "El Rol SII es obligatorio.";
        }
        if (!data.direccion.trim()) {
            errores.direccion = "La dirección es obligatoria.";
        }
        if (!data.numero) {
            errores.numero = "El número es obligatorio.";
        }
        if (!data.comuna.trim()) {
            errores.comuna = "La comuna es obligatoria.";
        }
        if (!data.region.trim()) {
            errores.region = "La región es obligatoria.";
        }
        if (data.numPisos < 0) {
            errores.numPisos = "El número de pisos no puede ser negativo.";
        }
        if (data.m2 <= 0) {
            errores.m2 = "Los metros cuadrados deben ser mayores a 0.";
        }

        return errores;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar los datos del formulario
        const nuevosErrores = validarCampos(formData);
        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        try {
            await onSave(formData); // Llamar al backend desde el componente padre
            setIsEditing(false);
        } catch (error) {
            console.error("Error al guardar los datos:", error);
            setErrorBackend("Ocurrió un error al guardar los datos. Intenta nuevamente.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {[{
                    label: "Rol SII",
                    name: "rolSII"
                }, {
                    label: "Dirección",
                    name: "direccion"
                }, {
                    label: "Número",
                    name: "numero",
                    type: "number"
                }, {
                    label: "Comuna",
                    name: "comuna"
                }, {
                    label: "Región",
                    name: "region"
                }, {
                    label: "Inscripción en Fojas",
                    name: "inscFojas"
                }, {
                    label: "Inscripción Número",
                    name: "inscNumero",
                    type: "number"
                }, {
                    label: "Año de Inscripción",
                    name: "inscYear",
                    type: "number"
                }, {
                    label: "Número de Pisos",
                    name: "numPisos",
                    type: "number"
                }, {
                    label: "Metros Cuadrados (m²)",
                    name: "m2",
                    type: "number",
                    step: "0.01"
                }, {
                    label: "Destino",
                    name: "destino"
                }].map(({ label, name, type = "text", step }) => (
                    <div key={name} style={{ marginBottom: "10px" }}>
                        <label>{label}:</label>
                        <input
                            type={type}
                            name={name}
                            step={step}
                            value={formData[name] || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                        {errores[name] && (
                            <p style={{ color: "red", fontSize: "12px" }}>{errores[name]}</p>
                        )}
                    </div>
                ))}

                {isEditing ? (
                    <div style={{ marginTop: "15px" }}>
                        <button type="submit" style={{ marginRight: "10px" }}>Guardar</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
                    </div>
                ) : (
                    <button type="button" onClick={() => setIsEditing(true)}>Editar</button>
                )}

                {errorBackend && (
                    <p style={{ color: "red", fontSize: "14px", marginTop: "10px" }}>{errorBackend}</p>
                )}
            </form>
        </div>
    );

};

export default DatosPropiedad;
