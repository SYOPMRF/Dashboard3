import { useContext, useState, useEffect } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { SidebarContext } from "../../context/SidebarContext";
import { supabase2 } from "../../supabase/supabase";
import jsPDF from "jspdf";
import "./Logros.scss";
import "jspdf-autotable";

const Logros = () => {
  const { openSidebar } = useContext(SidebarContext);

  const [badges, setBadges] = useState([
    {
      user_id: "a0cc675b-974a-4cd7-8347-f0987113f908",
      title: "Primer Logro",
      description: "Completaste tu primer tarea.",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/771/771222.png",
      scores: [], // Lista de puntajes
    },
    {
      user_id: "a0cc675b-974a-4cd7-8347-f0987113f908",
      title: "Explorador",
      description: "Visitaste todas las secciones.",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/771/771222.png",
      scores: [],
    },
    {
      user_id: "a0cc675b-974a-4cd7-8347-f0987113f908",
      title: "Maestro del Tiempo",
      description: "Lograste completar una tarea antes de tiempo.",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/771/771222.png",
      scores: [],
    },
    {
      user_id: "a0cc675b-974a-4cd7-8347-f0987113f908",
      title: "Maestro del agua",
      description: "Aprendiste el ciclo del agua.",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/771/771222.png",
      scores: [],
    },
    {
      user_id: "a0cc675b-974a-4cd7-8347-f0987113f908",
      title: "Nivel 10 Alcanzado",
      description: "Subiste al nivel 10.",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/771/771222.png",
      scores: [],
    },
  ]);

  const [loading, setLoading] = useState(false);

  // Función para obtener los scores del backend
  const fetchScores = async () => {
    setLoading(true);
    const response = await supabase2
      .from("user_game_progress")
      .select("user_id, score, created_at") // Obtener también created_at
      .order("created_at", { ascending: false }); // Ordenar por created_at en orden descendente
  
    if (!response || response.error) {
      console.error("Error al obtener los scores:", response?.error?.message);
      alert("No se pudieron obtener los puntajes. Intenta de nuevo.");
      setLoading(false);
      return; // Detener ejecución si hay error
    }
  
    const { data } = response;
  
    // Validar si 'data' es un arreglo y tiene los datos esperados
    if (!Array.isArray(data)) {
      console.warn("La respuesta no contiene datos válidos.");
      setLoading(false);
      return;
    }

    // Mapear los scores a las insignias correspondientes
    const updatedBadges = badges.map((badge) => {
      // Filtrar los puntajes del usuario correspondiente y ordenar por created_at
      const userScores = data
        .filter((scoreData) => scoreData.user_id === badge.user_id)
        .slice(0, 5); // Tomar solo los primeros 5 más recientes

      return {
        ...badge,
        scores: userScores.map((scoreData) => scoreData.score), // Asignar los 5 puntajes más recientes
      };
    });
  
    setBadges(updatedBadges);
    setLoading(false);
  };

  // Función para descargar como PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.text("Reporte de Insignias y Logros", 10, 10);

    const tableData = badges.map((badge) => [
      badge.title,
      badge.description,
      badge.scores.join(", "), // Mostrar los 5 puntajes más recientes en el PDF
    ]);

    doc.autoTable({
      head: [["Título", "Descripción", "Puntajes más recientes"]],
      body: tableData,
      startY: 20,
    });

    doc.save("reporte_logros.pdf");
  };

  useEffect(() => {
    fetchScores();
  }, []); // Obtener los scores al cargar el componente

  return (
    <div id="dashboard" style={{ textAlign: "center", padding: "20px" }}>
      <section className="content-area-top">
        <div className="area-top-l">
            <button
              className="sidebar-open-btn"
              type="button"
              onClick={openSidebar}
            >
              <MdOutlineMenu size={50} />
            </button>
        </div>
      </section>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#ff0004" }}>
        Insignias y Logros
      </h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
        Aquí puedes ver tus logros y puntuaciones
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
            role="article"
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
            <p style={{ fontSize: "1rem", color: "#007bff" }}>
              {badge.description}
            </p>
            <p style={{ fontSize: "1.2rem", color: "#007bff" }}>
              {badge.scores.length > 0
                ? `Últimos puntajes: ${badge.scores.join(", ")}`
                : "No hay puntajes disponibles"}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={handleDownloadPDF}
        style={{
          marginTop: "20px",
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
  );
};

export default Logros;
