import jsPDF from "jspdf";
import "jspdf-autotable"; // Para exportar tablas y contenido estructurado

const Logros = () => {
  const badges = [
    { 
      id: 1, 
      title: "Primer Logro", 
      description: "Completaste tu primer tarea.", 
      imageUrl: "https://cdn-icons-png.flaticon.com/512/771/771222.png" // URL de la imagen
    },
    { 
      id: 2, 
      title: "Explorador", 
      description: "Visitaste todas las secciones.", 
      imageUrl: "https://cdn-icons-png.flaticon.com/512/771/771222.png"
    },
    { 
      id: 3, 
      title: "Maestro del Tiempo", 
      description: "Lograste completar una tarea antes de tiempo.", 
      imageUrl: "https://cdn-icons-png.flaticon.com/512/771/771222.png"
    },
    { 
      id: 4, 
      title: "Colaborador", 
      description: "Ayudaste a un compañero.", 
      imageUrl: "https://cdn-icons-png.flaticon.com/512/771/771222.png"
    },
    { 
      id: 5, 
      title: "Nivel 10 Alcanzado", 
      description: "Subiste al nivel 10.", 
      imageUrl: "https://cdn-icons-png.flaticon.com/512/771/771222.png"
    },
  ];

  // Función para imprimir la página
  const handlePrint = () => {
    window.print();
  };

  // Función para descargar como PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.text("Reporte de Insignias y Logros", 10, 10);

    const tableData = badges.map((badge) => [
      badge.title,
      badge.description,
    ]);

    doc.autoTable({
      head: [["Título", "Descripción"]],
      body: tableData,
      startY: 20,
    });

    doc.save("reporte_logros.pdf");
  };

  return (
    <div id="dashboard" style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#ff0004"}}>Insignias y Logros</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
        Aquí puedes ver tus logros
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {badges.map((badge) => (
          <div
            key={badge.id}
            style={{
              border: "1px solid #ff0004",
              borderRadius: "10px",
              padding: "15px",
              width: "220px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 4px 8px rgba(0, 0, 255, 0.1)",
              textAlign: "center",
            }}
          >
            {/* Imagen del logro */}
            <img 
              src={badge.imageUrl} 
              alt={badge.title} 
              style={{ width: "80px", height: "80px", marginBottom: "10px" }} 
            />
            <h3
              style={{
                fontSize: "1.5rem",
                color: "#ff0004",
                margin: "10px 0",
              }}
            >
              {badge.title}
            </h3>
            <p style={{ fontSize: "1rem", color: "#ff0004" }}>{badge.description}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "30px" }}>
        <button
          onClick={handlePrint}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#ff0004",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Imprimir
        </button>
        <button
          onClick={handleDownloadPDF}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#ff0004",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Descargar PDF
        </button>
      </div>
    </div>
  );
};

export default Logros;
