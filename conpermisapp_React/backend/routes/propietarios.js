/*
const express = require('express');
const { getConnection, sql } = require('../db');
const router = express.Router();

// Obtener propietarios con filtro opcional por RUT
router.get('/', async (req, res) => {
    const { rut } = req.query;

    try {
        const pool = await getConnection();
        let query = 'SELECT * FROM Propietario';

        if (rut) {
            query += ' WHERE rut = @rut';
        }

        const request = pool.request();
        if (rut) {
            request.input('rut', sql.VarChar, rut);
        }

        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'No se encontraron propietarios.' });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener propietarios:', error);
        res.status(500).json({ error: 'Error al obtener propietarios.' });
    }
});

// Crear un nuevo propietario
router.post('/', async (req, res) => {
    const { rut, nombres, apellidos, email, telefono } = req.body;

    if (!rut || !nombres) {
        return res.status(400).json({ error: 'El RUT y el nombre son obligatorios.' });
    }

    try {
        const pool = await getConnection();

        const result = await pool.request()
            .input('rut', sql.VarChar, rut)
            .input('nombres', sql.VarChar, nombres)
            .input('apellidos', sql.VarChar, apellidos || null)
            .input('email', sql.VarChar, email || null)
            .input('telefono', sql.Int, telefono || null)
            .query(`
                INSERT INTO Propietario (
                    rut, nombres, apellidos, email, telefono
                ) OUTPUT Inserted.*
                VALUES (
                    @rut, @nombres, @apellidos, @email, @telefono
                )
            `);

        res.status(201).json({
            message: 'Propietario creado exitosamente.',
            propietario: result.recordset[0]
        });
    } catch (error) {
        console.error('Error al crear el propietario:', error);
        res.status(500).json({ error: 'Error al crear el propietario.' });
    }
});


router.delete("/:rut", async (req, res) => {
    const { rut } = req.params; 

    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input("rut", sql.VarChar, rut)
            .query("DELETE FROM Propietario WHERE rut = @rut");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Propietario no encontrado." });
        }

        res.status(200).json({ message: "Propietario eliminado exitosamente." });
    } catch (error) {
        console.error("Error al eliminar el propietario:", error);
        res.status(500).json({ message: "Error al eliminar el propietario." });
    }
});


// Actualizar propietario por RUT
router.put('/:rut', async (req, res) => {
    const { rut } = req.params;
    const data = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('rut', sql.VarChar, rut)
            .input('nombres', sql.VarChar, data.nombres)
            .input('apellidos', sql.VarChar, data.apellidos)
            .input('telefono', sql.VarChar, data.telefono)
            .query(`
                UPDATE Propietarios
                SET nombres = @nombres, apellidos = @apellidos, telefono = @telefono
                WHERE rut = @rut
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Propietario no encontrado.' });
        }

        res.json({ message: 'Propietario actualizado correctamente.' });
    } catch (error) {
        console.error('Error al actualizar propietario:', error);
        res.status(500).json({ error: 'Error al actualizar propietario.' });
    }
});


module.exports = router;
*/

// pgSQL
const express = require("express");
const { sequelize } = require("../db"); // Conexión a PostgreSQL
const router = express.Router();

// Obtener propietarios con filtro opcional por RUT
router.get("/", async (req, res) => {
    const { rut } = req.query;

    try {
        let query = "SELECT * FROM propietario";
        let replacements = {};

        if (rut) {
            query += " WHERE rut = :rut";
            replacements.rut = rut;
        }

        const [propietarios] = await sequelize.query(query, { replacements, type: sequelize.QueryTypes.SELECT });

        if (propietarios.length === 0) {
            return res.status(404).json({ error: "No se encontraron propietarios." });
        }

        res.status(200).json(propietarios);
    } catch (error) {
        console.error("Error al obtener propietarios:", error);
        res.status(500).json({ error: "Error al obtener propietarios." });
    }
});

// Crear un nuevo propietario
router.post("/", async (req, res) => {
    const { rut, nombres, apellidos, email, telefono } = req.body;

    if (!rut || !nombres) {
        return res.status(400).json({ error: "El RUT y el nombre son obligatorios." });
    }

    try {
        const [nuevoPropietario] = await sequelize.query(
            `INSERT INTO propietario (rut, nombres, apellidos, email, telefono)
             VALUES (:rut, :nombres, :apellidos, :email, :telefono) RETURNING *`,
            {
                replacements: { rut, nombres, apellidos, email, telefono },
                type: sequelize.QueryTypes.INSERT,
            }
        );

        res.status(201).json({
            message: "Propietario creado exitosamente.",
            propietario: nuevoPropietario,
        });
    } catch (error) {
        console.error("Error al crear el propietario:", error);
        res.status(500).json({ error: "Error al crear el propietario." });
    }
});

// Eliminar propietario por RUT
router.delete("/:rut", async (req, res) => {
    const { rut } = req.params;

    try {
        const [result] = await sequelize.query(
            "DELETE FROM propietario WHERE rut = :rut RETURNING *",
            {
                replacements: { rut },
                type: sequelize.QueryTypes.DELETE,
            }
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Propietario no encontrado." });
        }

        res.status(200).json({ message: "Propietario eliminado exitosamente." });
    } catch (error) {
        console.error("Error al eliminar el propietario:", error);
        res.status(500).json({ message: "Error al eliminar el propietario." });
    }
});

// Actualizar propietario por RUT
router.put("/:rut", async (req, res) => {
    const { rut } = req.params;
    const { nombres, apellidos, telefono } = req.body;

    try {
        const [result] = await sequelize.query(
            `UPDATE propietario
             SET nombres = :nombres, apellidos = :apellidos, telefono = :telefono
             WHERE rut = :rut RETURNING *`,
            {
                replacements: { rut, nombres, apellidos, telefono },
                type: sequelize.QueryTypes.UPDATE,
            }
        );

        if (result.length === 0) {
            return res.status(404).json({ error: "Propietario no encontrado." });
        }

        res.json({ message: "Propietario actualizado correctamente." });
    } catch (error) {
        console.error("Error al actualizar propietario:", error);
        res.status(500).json({ error: "Error al actualizar propietario." });
    }
});

module.exports = router;

