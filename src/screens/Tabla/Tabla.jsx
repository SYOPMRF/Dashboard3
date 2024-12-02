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

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const q = query(collection(db, "user_game_progress"), orderBy("score", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRanking(data);
      } catch (err) {
        console.error("Error fetching ranking:", err.message);
        setError("No se pudo cargar la tabla. Por favor, inténtalo más tarde.");
        alert("No se pudieron obtener los valores. Intenta de nuevo.");
      }
    };

    fetchRanking();
  }, []);

  const filteredRanking = ranking.filter(user =>
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
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#ff0004" }}>Tabla de Puntajes</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>Revisa cómo le van a los demás</p>

      {/* Campo de búsqueda */}
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

      {/* Botón para descargar CSV */}
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

      {/* Botón para ordenar por puntos */}
      <button
        onClick={() => handleSort("score")}
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
        Ordenar por puntos
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
            <th
              onClick={() => handleSort("id")}
              style={tableHeaderStyle}
            >
              Posición
            </th>
            <th
              onClick={() => handleSort("name")}
              style={tableHeaderStyle}
            >
              Usuario
            </th>
            <th
              onClick={() => handleSort("score")}
              style={tableHeaderStyle}
            >
              Puntos
            </th>
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
                {index + 1 === 1 ? "🥇" : index + 1 === 2 ? "🥈" : index + 1 === 3 ? "🥉" : index + 1}
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
  cursor: "pointer", // Indicando que el encabezado es interactivo
};

// Estilo para las celdas de datos
const tableCellStyle = {
  padding: "10px",
  textAlign: "center",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

export default TablaClasificacion;
