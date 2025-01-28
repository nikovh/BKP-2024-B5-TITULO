const admin = require('../firebaseAdmin');

// async function firebaseAuthMiddleware(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).send('No se proporcionó Token');
//     }

//     const token = authHeader.split(' ')[1];
//     try {
//         const decodedToken = await admin.auth().verifyIdToken(token);
//         // decodedToken.uid es el UID de firebase
//         req.user = decodedToken;
//         next();
//     } catch (error) {
//         return  res.status(401).send('Token invalido');
//     }
// }

// module.exports = firebaseAuthMiddleware;


module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No se proporcionó un token de autenticación." });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next(); // Continuar con la siguiente middleware o ruta
    } catch (error) {
        console.error("Error al verificar el token de Firebase:", error);
        res.status(401).json({ error: "Token de autenticación inválido." });
    }
};
