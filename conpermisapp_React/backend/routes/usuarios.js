const express = require('express');
const { getConnection, sql } = require('../db');
const router = express.Router();

// Obtener usuarios con filtros opcionales por RUT o email
router.get('/', async (req, res) => {
    const { rut, email } = req.query;

    try {
        const pool = await getConnection();
        let query = 'SELECT * FROM Usuario';

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
            return res.status(404).json({ error: 'Usuario no encontrado.' });
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
            .query('SELECT * FROM Usuario WHERE rut = @rut OR email = @email');

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
                INSERT INTO Usuario (
                    rut, nombres, apellidos, telefono, email, password, rol, patenteProfesional
                ) VALUES (
                    @rut, @nombres, @apellidos, @telefono, @email, @password, @rol, @patenteProfesional
                )
            `);

        res.status(201).json({ message: 'Usuario registrado exitosamente.' });
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
            .query("DELETE FROM Usuario WHERE rut = @rut");

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
                UPDATE Usuarios
                SET nombres = @nombres, apellidos = @apellidos, email = @email, telefono = @telefono
                WHERE rut = @rut
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.json({ message: 'Usuario actualizado correctamente.' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario.' });
    }
});

module.exports = router;
