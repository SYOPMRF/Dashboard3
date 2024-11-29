import React from "react";
import { AreaCards, AreaCharts, AreaTable, AreaTop } from "../../components";

const Dashboard = ({ title }) => {
  
  // Función para manejar la impresión
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="content-area">
      <h1>{title}</h1>
      <AreaTop />
      <AreaCards />
      <AreaCharts />
      <AreaTable />
      
      {/* Botón de imprimir */}
      <button 
        onClick={handlePrint}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",  // Cambia el color según lo desees
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Imprimir
      </button>
    </div>
  );
};

export default Dashboard;
