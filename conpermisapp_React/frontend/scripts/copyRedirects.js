const fs = require("fs");
const path = require("path");

const source = path.join(__dirname, "../public/_redirects");
const destination = path.join(__dirname, "../build/_redirects");

fs.copyFile(source, destination, (err) => {
    if (err) {
        console.error("❌ Error al copiar _redirects:", err);
        process.exit(1);
    } else {
        console.log("✅ _redirects copiado correctamente");
    }
});
