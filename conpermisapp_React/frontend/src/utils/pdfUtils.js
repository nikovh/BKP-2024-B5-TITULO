import jsPDF, { jspdf } from 'jspdf';

export function generarPdfFormulario(formData) {
    //formData es un objeto co toda la info del formulario
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('Documento PDF del Formulario', 10, 10);

    let yPos = 20;
    for (const [campo, valor] of Object.entries(formData)) {
        doc.text(`${campo}: ${valor}`, 10, yPos);
        yPos += 10;
    }

    // devolver el objeto doc para mostrarlo en el explorer
    return doc;
}

export function generarPdfExpedienteCompleto(formularios) {
    // formularios = array con varios formularios
    const doc = new jsPDF();
    let currentPage = 1;

    formularios.forEach((form, index) => {
        // cabecera para identificar el formulario
        doc.setFontSize(14);
        doc.text(`Formulario #${index + 1}`, 10, 10);

        // Escribimos campos de cada formulario
        let yPos = 20;
        for (const [campo, valor] of Object.entries(form)) {
            doc.setFontSize(12);
            doc.text(`${campo}: ${valor}`, 10, yPos);
            yPos += 10;
        }

        // Si hay más formularios, añadimos una página nueva
        if (index < formularios.length - 1) {
            doc.addPage();
            currentPage += 1;
        }
    });

    return doc;
}