import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase";  // Asegúrate de importar el cliente

// Función para descargar la tabla como CSV
const downloadCSV = (data) => {
  const csvRows = [];
  const headers = ["Posición", "Usuario", "Nivel", "Puntos"];
  csvRows.push(headers.join(","));

  data.forEach((user, index) => {
    const row = [
      index + 1 === 1 ? "🥇" : index + 1 === 2 ? "🥈" : index + 1 === 3 ? "🥉" : index + 1,
      user.name,
      user.level,
      user.points,
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
  const [ranking, setRanking] = useState([]); // Estado para almacenar los datos de Supabase
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "points", direction: "desc" });

  // Usar useEffect para cargar los datos desde Supabase cuando el componente se monta
  useEffect(() => {
    const fetchRanking = async () => {
      const { data, error } = await supabase
        .from('ranking')  // Nombre de la tabla en Supabase
        .select('*')
        .order('points', { ascending: false });  // Ordenar por puntos (descendente)
      
      if (error) {
        console.error('Error fetching ranking:', error.message);
      } else {
        setRanking(data);  // Establecer los datos en el estado
      }
    };

    fetchRanking();
  }, []);  // Solo se ejecuta una vez al montar el componente

  // Filtrar los datos por el nombre del usuario
  const filteredRanking = ranking.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  // Función para ordenar la tabla por columna
  const handleSort = (column) => {
    const direction = sortConfig.key === column && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: column, direction });

    const sortedData = [...filteredRanking].sort((a, b) => {
      if (a[column] < b[column]) return direction === "asc" ? -1 : 1;
      if (a[column] > b[column]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setRanking(sortedData);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#ff0004" }}>Tabla de Clasificación</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>Revisa quién lidera la competencia.</p>

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
        onClick={() => handleSort("points")}
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
              onClick={() => handleSort("level")}
              style={tableHeaderStyle}
            >
              Nivel
            </th>
            <th
              onClick={() => handleSort("points")}
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
              <td style={tableCellStyle}>{user.name}</td>
              <td style={tableCellStyle}>{user.level}</td>
              <td style={tableCellStyle}>{user.points}</td>
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
