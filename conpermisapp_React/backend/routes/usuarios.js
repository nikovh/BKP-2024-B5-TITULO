/*
const express = require('express');
const { getConnection, sql } = require('../db');
const router = express.Router();

//Obtener usuarios con filtros opcionales por RUT o email
router.get('/', async (req, res) => {
    const { rut, email } = req.query;

    try {
        const pool = await getConnection();
        let query = 'SELECT * FROM usuario';

        if (rut) {
            query += ' WHERE rut = @rut';
        } else if (email) {
            query += ' WHERE email = @email';
        }

        const request = pool.request();

        if (rut) {
            request.input('rut', sql.VarChar, rut);
        } else if (email) {
            request.input('email', sql.VarChar, email);
        }

        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'usuario no encontrado.' });
        }

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error al obtener usuarios:', err);
        res.status(500).json({ error: 'Error al obtener usuarios.' });
    }
});



// Crear un nuevo usuario
router.post('/', async (req, res) => {
    const { rut, nombres, apellidos, telefono, email, password, rol, patenteProfesional } = req.body;

    if (!rut || !nombres || !email || !password) {
        return res.status(400).json({ error: 'Completa los campos obligatorios.' });
    }

    try {
        const pool = await getConnection();

        const usuarioExistente = await pool.request()
            .input('rut', sql.VarChar, rut)
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM usuario WHERE rut = @rut OR email = @email');

        if (usuarioExistente.recordset.length > 0) {
            return res.status(400).json({ error: 'El RUT o correo electrónico ya está registrado.' });
        }

        await pool.request()
            .input('rut', sql.VarChar, rut)
            .input('nombres', sql.VarChar, nombres)
            .input('apellidos', sql.VarChar, apellidos)
            .input('telefono', sql.Int, telefono)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .input('rol', sql.VarChar, rol)
            .input('patenteProfesional', sql.VarChar, patenteProfesional || null)
            .query(`
                INSERT INTO usuario (
                    rut, nombres, apellidos, telefono, email, password, rol, patenteProfesional
                ) VALUES (
                    @rut, @nombres, @apellidos, @telefono, @email, @password, @rol, @patenteProfesional
                )
            `);

        res.status(201).json({ message: 'usuario registrado exitosamente.' });
    } catch (err) {
        console.error('Error al registrar el usuario:', err);
        res.status(500).json({ error: 'Error al registrar al usuario.' });
    }
});


router.delete("/:rut", async (req, res) => {
    const { rut } = req.params; // Obtener el RUT desde los parámetros

    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input("rut", sql.VarChar, rut)
            .query("DELETE FROM usuario WHERE rut = @rut");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Arquitecto no encontrado." });
        }

        res.status(200).json({ message: "Arquitecto eliminado exitosamente." });
    } catch (error) {
        console.error("Error al eliminar el Arquitecto:", error);
        res.status(500).json({ message: "Error al eliminar el Arquitecto." });
    }
});

// Actualizar usuario por RUT
router.put('/:rut', async (req, res) => {
    const { rut } = req.params;
    const data = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('rut', sql.VarChar, rut)
            .input('nombres', sql.VarChar, data.nombres)
            .input('apellidos', sql.VarChar, data.apellidos)
            .input('email', sql.VarChar, data.email)
            .input('telefono', sql.VarChar, data.telefono)
            .query(`
                UPDATE usuario
                SET nombres = @nombres, apellidos = @apellidos, email = @email, telefono = @telefono
                WHERE rut = @rut
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'usuario no encontrado.' });
        }

        res.json({ message: 'usuario actualizado correctamente.' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario.' });
    }
});

module.exports = router;
*/

// postgreSQL
const express = require("express");
const { sequelize } = require("../db"); // Conexión a la BD
const router = express.Router();

//  Obtener usuarios con filtro opcional por RUT o email
router.get("/", async (req, res) => {
    const { rut, email } = req.query;

    try {
        let query = "SELECT * FROM usuario";
        let replacements = {};

        if (rut) {
            query += " WHERE rut = :rut";
            replacements.rut = rut;
        } else if (email) {
            query += " WHERE email = :email";
            replacements.email = email;
        }

        const users = await sequelize.query(query, {
            replacements,
            type: sequelize.QueryTypes.SELECT
        });

        if (users.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        res.status(200).json(users);
    } catch (err) {
        console.error("Error al obtener usuarios:", err);
        res.status(500).json({ error: "Error al obtener usuarios." });
    }
});



//  Crear un nuevo usuario
router.post("/", async (req, res) => {
    const { rut, nombres, apellidos, telefono, email, password, rol, patente_profesional } = req.body;

    if (!rut || !nombres || !email || !password) {
        return res.status(400).json({ error: "Completa los campos obligatorios." });
    }

    try {
        // Verificar si el usuario ya existe
        const usuarioExistente = await sequelize.query(
            "SELECT * FROM usuario WHERE rut = :rut OR email = :email",
            {
                replacements: { rut, email },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (usuarioExistente.length > 0) {
            return res.status(400).json({ error: "El RUT o correo electrónico ya está registrado." });
        }

        // Insertar nuevo usuario
        await sequelize.query(
            `INSERT INTO usuario (rut, nombres, apellidos, telefono, email, password, rol, patente_profesional)
             VALUES (:rut, :nombres, :apellidos, :telefono, :email, :password, :rol, :patente_profesional)`,
            {
                replacements: {
                    rut, nombres, apellidos, telefono, email, password,
                    rol: rol || "usuario", // Valor por defecto
                    patente_profesional: patente_profesional || null
                }
            }
        );

        res.status(201).json({ message: "Usuario registrado exitosamente." });
    } catch (err) {
        console.error("Error al registrar el usuario:", err);
        res.status(500).json({ error: "Error al registrar el usuario." });
    }
});

// Eliminar usuario por RUT
router.delete("/:rut", async (req, res) => {
    const { rut } = req.params;

    try {
        const result = await sequelize.query(
            "DELETE FROM usuario WHERE rut = :rut",
            { replacements: { rut } }
        );

        if (result[1] === 0) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        res.status(200).json({ message: "Usuario eliminado exitosamente." });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ message: "Error al eliminar usuario." });
    }
});

// Actualizar usuario por RUT
router.put("/:rut", async (req, res) => {
    const { rut } = req.params;
    const { nombres, apellidos, email, telefono } = req.body;

    try {
        const result = await sequelize.query(
            `UPDATE usuario
             SET nombres = :nombres, apellidos = :apellidos, email = :email, telefono = :telefono
             WHERE rut = :rut`,
            {
                replacements: { rut, nombres, apellidos, email, telefono }
            }
        );

        if (result[1] === 0) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        res.json({ message: "Usuario actualizado correctamente." });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ error: "Error al actualizar usuario." });
    }
});

module.exports = router;