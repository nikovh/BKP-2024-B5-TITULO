// const express = require('express');
// const { getConnection, sql } = require('../db');
// const router = express.Router();

// // GET /propiedades/
// // Obtener todas las propiedades
// router.get('/', async (req, res) => {
//     try {
//         const pool = await getConnection();
//         const query = 'SELECT * FROM Propiedad';
//         const request = pool.request();
//         const result = await request.query(query);
//         res.status(200).json(result.recordset);
//     } catch (error) {
//         console.error('Error al obtener propiedades:', error);
//         res.status(500).json({ error: 'Error al obtener propiedades' });
//     }
// });


// // GET /propiedades/:rolSII
// // Obtener una propiedad por su rolSII
// router.get('/:rolSII', async (req, res) => {
//     const { rolSII } = req.params;

//     try {
//         const pool = await getConnection();
//         const result = await pool.request()
//             .input('rolSII', sql.VarChar, rolSII)
//             .query(`
//                 SELECT * 
//                 FROM Propiedad 
//                 WHERE rolSII = @rolSII
//             `);

//         if (result.recordset.length === 0) {
//             return res.status(404).json({ error: 'Propiedad no encontrada.' });
//         }

//         res.status(200).json(result.recordset[0]);
//     } catch (error) {
//         console.error('Error al obtener la propiedad:', error);
//         res.status(500).json({ error: 'Error al obtener la propiedad.' });
//     }
// });

// // GET /propiedades/expedientes/:expedienteId
// // Obtener propiedades asociadas a un expediente específico
// router.get('/expedientes/:expedienteId', async (req, res) => {
//     const { expedienteId } = req.params;

//     try {
//         const pool = await getConnection();
//         const result = await pool.request()
//             .input('expedienteId', sql.Int, expedienteId)
//             .query(`
//                 SELECT * 
//                 FROM Propiedad 
//                 WHERE Expediente_id = @expedienteId
//             `);

//         if (result.recordset.length === 0) {
//             return res.status(404).json({ error: 'No se encontraron propiedades para este expediente' });
//         }

//         res.status(200).json(result.recordset[0]);
//     } catch (error) {
//         console.error('Error al obtener las propiedades:', error);
//         res.status(500).json({ error: 'Error al obtener las propiedades' });
//     }
// });



// // POST /propiedades/
// // Crear una nueva propiedad
// router.post('/', async (req, res) => {
//     const {
//         rolSII,
//         direccion,
//         numero,
//         comuna,
//         region,
//         inscFojas,
//         inscNumero,
//         inscYear,
//         numPisos,
//         m2,
//         destino,
//         expedienteId
//     } = req.body;

//     // Validación de campos obligatorios
//     if (!rolSII || !direccion || !comuna || !region) {
//         return res.status(400).json({ error: 'Campos obligatorios faltantes.' });
//     }

//     try {
//         const pool = await getConnection();

//         // Insertar propiedad
//         const result = await pool.request()
//             .input('rolSII', sql.VarChar, rolSII)
//             .input('direccion', sql.VarChar, direccion)
//             .input('numero', sql.Int, numero || null)
//             .input('comuna', sql.VarChar, comuna)
//             .input('region', sql.VarChar, region)
//             .input('inscFojas', sql.VarChar, inscFojas || null)
//             .input('inscNumero', sql.Int, inscNumero || null)
//             .input('inscYear', sql.Int, inscYear || null)
//             .input('numPisos', sql.Int, numPisos || null)
//             .input('m2', sql.Decimal(10, 2), m2 || null)
//             .input('destino', sql.VarChar, destino || null)
//             .input('expedienteId', sql.Int, expedienteId || null)
//             .query(`
//                 INSERT INTO Propiedad (
//                     rolSII, direccion, numero, comuna, region,
//                     inscFojas, inscNumero, inscYear, numPisos, m2, destino, Expediente_id
//                 )
//                 OUTPUT Inserted.*
//                 VALUES (
//                     @rolSII, @direccion, @numero, @comuna, @region,
//                     @inscFojas, @inscNumero, @inscYear, @numPisos, @m2, @destino, @expedienteId
//                 )
//             `);

//         res.status(201).json({
//             message: 'Propiedad creada exitosamente.',
//             propiedad: result.recordset[0]
//         });
//     } catch (error) {
//         console.error('Error al crear la propiedad:', error);
//         res.status(500).json({ error: 'Error al crear la propiedad.' });
//     }
// });


// module.exports = router;




/*
const express = require('express');
const { getConnection, sql } = require('../db');
const router = express.Router();

// Obtener propiedades con filtro opcional por rolSII o expedienteId
router.get('/', async (req, res) => {
    const { rolSII, expedienteId } = req.query;

    try {
        const pool = await getConnection();
        let query = 'SELECT * FROM Propiedad';

        if (rolSII) {
            query += ' WHERE rolSII = @rolSII';
        } else if (expedienteId) {
            query += ' WHERE Expediente_id = @expedienteId';
        }

        const request = pool.request();

        if (rolSII) {
            request.input('rolSII', sql.VarChar, rolSII);
        } else if (expedienteId) {
            request.input('expedienteId', sql.Int, expedienteId);
        }

        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'No se encontraron propiedades.' });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener propiedades:', error);
        res.status(500).json({ error: 'Error al obtener propiedades.' });
    }
});

// NO CONSIDERAR PORQUE ESTÁ EN EXPEDIENTE COMO: router.get('/:id/detalle', async (req, res) => {
// // obtener el expediente asociado a una propiedad especifica
// router.get('/expedientes/:id/detalle', async (req, res) => {
//     const { id } = req.params;

//     try {
//         const pool = await getConnection();

//         // Obtener datos del expediente
//         const expedienteQuery = await pool.request()
//             .input('id', sql.Int, id)
//             .query(`
//                 SELECT 
//                     e.id, 
//                     e.descripcion, 
//                     e.tipo, 
//                     e.subtipo, 
//                     e.fechaCreacion AS fechaCreacion, 
//                     p.rut AS propietarioRut, 
//                     p.nombres AS propietarioNombres, 
//                     p.apellidos AS propietarioApellidos 
//                 FROM Expedientes e
//                 INNER JOIN Propietario p ON e.propietario_rut = p.rut
//                 WHERE e.id = @id
//             `);

//         if (expedienteQuery.recordset.length === 0) {
//             return res.status(404).json({ error: 'Expediente no encontrado.' });
//         }

//         const expediente = expedienteQuery.recordset[0];

//         // Obtener datos de la propiedad asociada
//         const propiedadQuery = await pool.request()
//             .input('expedienteId', sql.Int, id)
//             .query(`
//                 SELECT 
//                     rolSII, 
//                     direccion, 
//                     numero, 
//                     comuna, 
//                     region, 
//                     inscFojas, 
//                     inscNumero, 
//                     inscYear, 
//                     numPisos, 
//                     m2, 
//                     destino 
//                 FROM Propiedad
//                 WHERE expediente_id = @expedienteId
//             `);

//         const propiedad = propiedadQuery.recordset[0] || null;

//         res.status(200).json({ expediente, propiedad });
//     } catch (err) {
//         console.error('Error al obtener los datos del expediente:', err);
//         res.status(500).json({ error: 'Error al obtener los datos del expediente.' });
//     }
// });


// Crear una nueva propiedad
router.post('/', async (req, res) => {
    const {
        rolSII,
        direccion,
        numero,
        comuna,
        region,
        inscFojas,
        inscNumero,
        inscYear,
        numPisos,
        m2,
        destino,
        expedienteId
    } = req.body;

    if (!rolSII || !direccion || !numero || !comuna || !region) {
        return res.status(400).json({ error: 'Campos obligatorios faltantes.' });
    }

    try {
        const pool = await getConnection();

        const result = await pool.request()
            .input('rolSII', sql.VarChar, rolSII)
            .input('direccion', sql.VarChar, direccion)
            .input('numero', sql.Int, numero)
            .input('comuna', sql.VarChar, comuna)
            .input('region', sql.VarChar, region)
            .input('inscFojas', sql.VarChar, inscFojas || null)
            .input('inscNumero', sql.Int, inscNumero || null)
            .input('inscYear', sql.Int, inscYear || null)
            .input('numPisos', sql.Int, numPisos || null)
            .input('m2', sql.Decimal(10, 2), m2 || null)
            .input('destino', sql.VarChar, destino || null)
            .input('expedienteId', sql.Int, expedienteId || null)
            .query(`
                INSERT INTO Propiedad (
                    rolSII, direccion, numero, comuna, region,
                    inscFojas, inscNumero, inscYear, numPisos, m2, destino, Expediente_id
                )
                OUTPUT Inserted.*
                VALUES (
                    @rolSII, @direccion, @numero, @comuna, @region,
                    @inscFojas, @inscNumero, @inscYear, @numPisos, @m2, @destino, @expedienteId
                )
            `);

        res.status(201).json({
            message: 'Propiedad creada exitosamente.',
            propiedad: result.recordset[0]
        });
    } catch (error) {
        console.error('Error al crear la propiedad:', error);
        res.status(500).json({ error: 'Error al crear la propiedad.' });
    }
});


// Actualizar propiedad por Expediente_id
router.put('/:expedienteId', async (req, res) => {
    const { expedienteId } = req.params;
    const data = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('expedienteId', sql.Int, expedienteId)
            .input('direccion', sql.VarChar, data.direccion)
            .input('numero', sql.Int, data.numero)
            .input('region', sql.VarChar, data.region)
            .query(`
                UPDATE Propiedades
                SET direccion = @direccion, numero = @numero, region = @region
                WHERE Expediente_id = @expedienteId
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Propiedad no encontrada.' });
        }

        res.json({ message: 'Propiedad actualizada correctamente.' });
    } catch (error) {
        console.error('Error al actualizar propiedad:', error);
        res.status(500).json({ error: 'Error al actualizar propiedad.' });
    }
});


module.exports = router;
*/


// corregido para PostgreSQL
const express = require("express");
const { sequelize } = require("../db"); // Conexión a PostgreSQL
const router = express.Router();

// Obtener propiedades con filtro opcional por rolSII o expedienteId
router.get("/", async (req, res) => {
    const { rolSII, expedienteId } = req.query;

    try {
        let query = "SELECT * FROM propiedad";
        let replacements = {};

        if (rolSII) {
            query += " WHERE rolSII = :rolSII";
            replacements.rolSII = rolSII;
        } else if (expedienteId) {
            query += " WHERE expediente_id = :expedienteId";
            replacements.expedienteId = expedienteId;
        }

        const [propiedades] = await sequelize.query(query, { replacements, type: sequelize.QueryTypes.SELECT });

        if (propiedades.length === 0) {
            return res.status(404).json({ error: "No se encontraron propiedades." });
        }

        res.status(200).json(propiedades);
    } catch (error) {
        console.error("Error al obtener propiedades:", error);
        res.status(500).json({ error: "Error al obtener propiedades." });
    }
});

// Crear una nueva propiedad
router.post("/", async (req, res) => {
    const {
        rolSII,
        direccion,
        numero,
        comuna,
        region,
        inscFojas,
        inscNumero,
        inscYear,
        numPisos,
        m2,
        destino,
        expedienteId,
    } = req.body;

    if (!rolSII || !direccion || !numero || !comuna || !region) {
        return res.status(400).json({ error: "Campos obligatorios faltantes." });
    }

    try {
        const [nuevaPropiedad] = await sequelize.query(
            `INSERT INTO propiedad (
                rolSII, direccion, numero, comuna, region,
                inscFojas, inscNumero, inscYear, numPisos, m2, destino, expediente_id
            ) VALUES (
                :rolSII, :direccion, :numero, :comuna, :region,
                :inscFojas, :inscNumero, :inscYear, :numPisos, :m2, :destino, :expedienteId
            ) RETURNING *`,
            {
                replacements: { rolSII, direccion, numero, comuna, region, inscFojas, inscNumero, inscYear, numPisos, m2, destino, expedienteId },
                type: sequelize.QueryTypes.INSERT,
            }
        );

        res.status(201).json({
            message: "Propiedad creada exitosamente.",
            propiedad: nuevaPropiedad,
        });
    } catch (error) {
        console.error("Error al crear la propiedad:", error);
        res.status(500).json({ error: "Error al crear la propiedad." });
    }
});

// Actualizar propiedad por Expediente_id
router.put("/:expedienteId", async (req, res) => {
    const { expedienteId } = req.params;
    const { direccion, numero, region } = req.body;

    try {
        const [result] = await sequelize.query(
            `UPDATE propiedad
             SET direccion = :direccion, numero = :numero, region = :region
             WHERE expediente_id = :expedienteId RETURNING *`,
            {
                replacements: { expedienteId, direccion, numero, region },
                type: sequelize.QueryTypes.UPDATE,
            }
        );

        if (result.length === 0) {
            return res.status(404).json({ error: "Propiedad no encontrada." });
        }

        res.json({ message: "Propiedad actualizada correctamente." });
    } catch (error) {
        console.error("Error al actualizar propiedad:", error);
        res.status(500).json({ error: "Error al actualizar propiedad." });
    }
});

module.exports = router;
