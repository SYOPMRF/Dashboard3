import React, { useState } from "react";

// Datos de ejemplo de los microdesafíos disponibles
const desafios = [
  { id: 1, title: "Desafío de Programación", description: "Resuelve un problema de codificación en JavaScript.", completed: false },
  { id: 2, title: "Desafío de Diseño", description: "Diseña una interfaz de usuario para una app de e-commerce.", completed: false },
  { id: 3, title: "Desafío de UX", description: "Haz un análisis de la experiencia de usuario de una página web.", completed: false },
  { id: 4, title: "Desafío de Algoritmos", description: "Resuelve un problema de algoritmos con eficiencia en tiempo.", completed: false },
  { id: 5, title: "Desafío de Front-End", description: "Construye una página web responsiva utilizando HTML, CSS y JavaScript.", completed: false },
  { id: 6, title: "Desafío de Backend", description: "Desarrolla una API con Node.js.", completed: false },
  { id: 7, title: "Desafío de Git", description: "Realiza un pull request con cambios en un repositorio de GitHub.", completed: false },
  { id: 8, title: "Desafío de Testing", description: "Escribe pruebas unitarias para una función de JavaScript.", completed: false },
  { id: 9, title: "Desafío de Seguridad", description: "Implementa medidas básicas de seguridad en una app web.", completed: false },
  { id: 10, title: "Desafío de Optimización", description: "Mejora el rendimiento de una página web.", completed: false },
];

const Micro = () => {
  const [challenges, setChallenges] = useState(desafios);
  const [completedFilter, setCompletedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const challengesPerPage = 3; // Número de desafíos por página

  // Filtrar los desafíos según el estado (pendientes, completados o todos)
  const filteredChallenges = challenges.filter((challenge) => {
    if (completedFilter === "all") return true;
    return completedFilter === "completed" ? challenge.completed : !challenge.completed;
  });

  // Calcular las páginas
  const totalPages = Math.ceil(filteredChallenges.length / challengesPerPage);
  const startIndex = (currentPage - 1) * challengesPerPage;
  const paginatedChallenges = filteredChallenges.slice(startIndex, startIndex + challengesPerPage);

  const handleComplete = (id) => {
    setChallenges(challenges.map((challenge) =>
      challenge.id === id ? { ...challenge, completed: true } : challenge
    ));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (filter) => {
    setCompletedFilter(filter);
    setCurrentPage(1); // Resetear a la primera página cuando cambia el filtro
  };

  // Calcular estadísticas de progreso
  const completedCount = challenges.filter(challenge => challenge.completed).length;
  const totalChallenges = challenges.length;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#ff0004" }}>Microdesafíos Disponibles</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
        ¡Diviértete y aprende con estos microdesafíos!
      </p>

      {/* Filtro */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => handleFilterChange("all")}
          style={{ padding: "10px", margin: "5px", backgroundColor: completedFilter === "all" ? "#ff0004" : "#f1f1f1", color: completedFilter === "all" ? "#fff" : "#007bff" }}
        >
          Todos
        </button>
        <button
          onClick={() => handleFilterChange("completed")}
          style={{ padding: "10px", margin: "5px", backgroundColor: completedFilter === "completed" ? "#ff0004" : "#f1f1f1", color: completedFilter === "completed" ? "#fff" : "#007bff" }}
        >
          Completados
        </button>
        <button
          onClick={() => handleFilterChange("pending")}
          style={{ padding: "10px", margin: "5px", backgroundColor: completedFilter === "pending" ? "#ff0004" : "#f1f1f1", color: completedFilter === "pending" ? "#fff" : "#007bff" }}
        >
          Pendientes
        </button>
      </div>

      {/* Estadísticas de Progreso */}
      <div style={{ marginBottom: "30px", fontSize: "1.1rem" }}>
        <p>
          <strong>Progreso:</strong> {completedCount} de {totalChallenges} desafíos completados ({((completedCount / totalChallenges) * 100).toFixed(2)}%)
        </p>
      </div>

      {/* Mostrar los desafíos filtrados */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
        {paginatedChallenges.map((challenge) => (
          <div
            key={challenge.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              width: "300px",
              backgroundColor: challenge.completed ? "#d4edda" : "#f9f9f9",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              position: "relative",
            }}
          >
            <h3 style={{ fontSize: "1.5rem", color: "#ff0004", margin: "10px 0" }}>
              {challenge.title}
            </h3>
            <p style={{ fontSize: "1rem", color: "#555", marginBottom: "80px" }}>{challenge.description}</p>
            <button
              onClick={() => handleComplete(challenge.id)}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: challenge.completed ? "#28a745" : "#ff0004",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                position: "absolute",
                bottom: "15px",
                left: "50%",
                transform: "translateX(-50%)",
              }}
              disabled={challenge.completed}
            >
              {challenge.completed ? "Completado" : "Marcar como Completado"}
            </button>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#ff0004",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          Anterior
        </button>
        <span style={{ fontSize: "1.1rem", marginRight: "10px" }}>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ff0004",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Micro;
