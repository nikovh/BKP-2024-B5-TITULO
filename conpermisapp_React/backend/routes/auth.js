// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const SECRET_KEY = '';

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     // Verifica credenciales en la DB
//     // ejemplo :
//     if (email === 'nvalenzuelah@alumno.iplacex.cl' && password === 'nicolas') {
//         // Generar token
//         const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });

//         // Retorna token al cliente
//         return res.json({ token });
//     } else {
//         return res.status(401).json({ error: 'Credenciales inválidas' });
//     }
// });

// module.exports = router;

