import React, { useState, useEffect, useContext } from "react";
import "./Tabla.scss";
import { MdOutlineMenu } from "react-icons/md";
import { SidebarContext } from "../../context/SidebarContext";
import { db, collection, getDocs, query, orderBy } from "../../firebase/firebase";

const TablaClasificacion = () => {
  const { openSidebar } = useContext(SidebarContext);
  const [ranking, setRanking] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [sortDirection, setSortDirection] = useState("desc"); // Estado para manejar la direcci贸n del orden

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const q = query(collection(db, "user_game_progress"), orderBy("score", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRanking(data);
      } catch (err) {
        console.error("Error fetching ranking:", err.message);
        setError("No se pudo cargar la tabla. Por favor, int茅ntalo m谩s tarde.");
        alert("No se pudieron obtener los valores. Intenta de nuevo.");
      }
    };

    fetchRanking();
  }, []);

  // Funci贸n para descargar CSV
  const downloadCSV = (data) => {
    const csvHeader = ["Posición", "Usuario", "Puntos"];
    const csvRows = data.map((user, index) => [
      index + 1, // Posici贸n
      user.email, // Usuario
      user.score, // Puntos
    ]);

    // Construcci贸n del contenido CSV con BOM para compatibilidad con Excel
    const csvContent = [
      "\uFEFF", // Agregar BOM para compatibilidad con Excel
      csvHeader.join(","), // Encabezados
      ...csvRows.map((row) => row.join(",")), // Filas
    ].join("\n");

    // Crear archivo descargable
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tabla_puntajes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Funci贸n para ordenar los puntos en ambas direcciones
  const handleSort = () => {
    const newDirection = sortDirection === "desc" ? "asc" : "desc";
    const sortedRanking = [...ranking].sort((a, b) =>
      newDirection === "asc" ? a.score - b.score : b.score - a.score
    );
    setRanking(sortedRanking);
    setSortDirection(newDirection); // Actualiza la direcci贸n del orden
  };

  // Filtrar usuarios por b煤squeda
  const filteredRanking = ranking.filter((user) =>
    user.email && user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
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
        Tabla de Puntajes
      </h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
        Revisa cómo le van a los demás
      </p>

      {/* Campo de b煤squeda */}
      <input
        type="text"
        placeholder="Buscar usuario..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          width: "300px",
          marginRight: "20px",
          marginBottom: "20px",
        }}
      />

      {/* Bot贸n para descargar CSV */}
      <button
        onClick={() => downloadCSV(filteredRanking)}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#ff0004",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginRight: "20px",
          marginBottom: "20px",
        }}
      >
        Descargar como CSV
      </button>

      {/* Bot贸n para alternar el orden de puntos */}
      <button
        onClick={handleSort}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#ff0004",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Ordenar por puntos ({sortDirection === "desc" ? "Descendente" : "Ascendente"})
      </button>

      {/* Tabla */}
      <table
        style={{
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#ff0004", color: "white" }}>
            <th style={tableHeaderStyle}>Posición</th>
            <th style={tableHeaderStyle}>Usuario</th>
            <th style={tableHeaderStyle}>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {filteredRanking.map((user, index) => (
            <tr
              key={user.id}
              style={{
                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
              }}
            >
              <td style={tableCellStyle}>
                {index + 1 === 1
                  ? "🥇"
                  : index + 1 === 2
                  ? "🥈"
                  : index + 1 === 3
                  ? "🥉"
                  : index + 1}
              </td>
              <td style={tableCellStyle}>{user.email}</td>
              <td style={tableCellStyle}>{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Estilo para las celdas de encabezado
const tableHeaderStyle = {
  padding: "10px",
  textAlign: "left",
  border: "1px solid #ccc",
  fontSize: "1rem",
  cursor: "pointer",
};

// Estilo para las celdas de datos
const tableCellStyle = {
  padding: "10px",
  textAlign: "center",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

export default TablaClasificacion;