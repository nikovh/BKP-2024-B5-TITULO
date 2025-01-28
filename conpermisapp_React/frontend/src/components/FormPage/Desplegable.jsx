import React, { useState } from "react";

const Desplegable = ({ title, children, defaultExpanded }) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded || false);

  const alternarDesplegable = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
      <div className={`desplegable ${isOpen ? "desplegable-abierto" : "desplegable-cerrado"}`}
        onClick={alternarDesplegable}
        style={{
          cursor: "pointer",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderBottom: isOpen ? "1px solid #ccc" : "none",
        }}
      >
        <strong>{title}</strong>
        <span style={{ float: "right" }}>{isOpen ? "▲" : "▼"}</span>
      </div >
      {isOpen && <div style={{ padding: "10px" }}>{children}</div>}
    </div>
  );
};

export default Desplegable;
