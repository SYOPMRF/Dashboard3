import React, { useState, useEffect, useContext } from "react";
import "./Tabla.scss";
import { MdOutlineMenu } from "react-icons/md";
import { SidebarContext } from "../../context/SidebarContext";
import { supabase2 } from "../../supabase/supabase";  // Asegúrate de importar el cliente

// Función para descargar la tabla como CSV
const downloadCSV = (data) => {
  const csvRows = [];
  const headers = ["Posición", "Usuario", "Puntos"];
  csvRows.push(headers.join(","));

  data.forEach((user, index) => {
    const row = [
      index + 1 === 1 ? "🥇" : index + 1 === 2 ? "🥈" : index + 1 === 3 ? "🥉" : index + 1,
      user.email,   // Asegúrate de usar user.email si es el campo correcto
      user.score || 0,  // Si no existe un campo 'score', establece un valor por defecto
    ];
    csvRows.push(row.join(","));
  });

  const csvData = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const csvUrl = URL.createObjectURL(csvData);
  const link = document.createElement("a");
  link.href = csvUrl;
  link.download = "tabla_clasificacion.csv";
  link.click();
};


const TablaClasificacion = () => {
  const { openSidebar } = useContext(SidebarContext);
  const [ranking, setRanking] = useState([]); // Estado para almacenar los datos de Supabase
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "score", direction: "desc" });
  const [error, setError] = useState(null);

  // Usar useEffect para cargar los datos desde Supabase cuando el componente se monta
  useEffect(() => {
    const fetchRanking = async () => {
      const { data, error } = await supabase2
        .from('user_game_progress')  // Nombre de la tabla en Supabase
        .select('*')
        .order('score', { ascending: false });  // Ordenar por puntos (descendente)
      
      if (error) {
        console.error('Error fetching ranking:', error.message);
        setError("No se pudo cargar la tabla. Por favor, inténtalo más tarde.");
        alert("No se pudieron obtener los valores. Intenta de nuevo.");
      } else {
        setRanking(data);  // Establecer los datos en el estado
      }
    };

    fetchRanking();
  }, []);  // Solo se ejecuta una vez al montar el componente

  // Filtrar los datos por el nombre del usuario
  const filteredRanking = ranking.filter((user) =>
    user.email && user.email.toLowerCase().includes(search.toLowerCase())
  );
  

  const handleSort = (column) => {
    // Determinamos la dirección del orden, alternando entre ascendente y descendente
    const direction = sortConfig.key === column && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: column, direction });
  
    // Ordenamos la data basándonos en la columna seleccionada
    const sortedData = [...ranking].sort((a, b) => {
      if (column === "name") {
        // Para ordenar alfabéticamente por nombre de usuario
        if (a[column].toLowerCase() < b[column].toLowerCase()) return direction === "asc" ? -1 : 1;
        if (a[column].toLowerCase() > b[column].toLowerCase()) return direction === "asc" ? 1 : -1;
      } else {
        // Para las otras columnas, como "score"
        if (a[column] < b[column]) return direction === "asc" ? -1 : 1;
        if (a[column] > b[column]) return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  
    // Actualizamos el estado con los datos ordenados
    setRanking(sortedData);
  };
  

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#ff0004" }}>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

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
