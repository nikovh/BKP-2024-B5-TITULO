import React, { useRef } from "react";
import { jsPDF } from 'jspdf';
import html2canvas from "html2canvas";

const GenerarPDF = ({ children, fileName }) => {
  const pdfRef = useRef();

  const generaPDF = async () => {
    const input = pdfRef.current;
    const canvas = await html2canvas(input, {
      scale: 3,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfAncho = pdf.internal.pageSize.getWidth();
    const pdfAlto = (imgProps.height * pdfAncho) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0,0, pdfAncho, pdfAlto);
    pdf.save(fileName || "conPermisApp-doc.pdf");
  };

  return (
    <div>
      {/* Área que será capturada para el PDF */}
      <div ref={pdfRef} style={{ padding: "20mm", background: "#fff" }}>
        {children}
      </div>

      {/* Botón para generar el PDF */}
      <button onClick={generaPDF} style={{ marginTop: "20px", padding: "10px 20px" }}>
        Descargar PDF
      </button>
    </div>
  );
};

export default GenerarPDF;