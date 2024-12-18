import React, { useState, useContext, useEffect } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { SidebarContext } from "../../context/SidebarContext";
import { supabase2 } from "../../supabase/supabase"; // Asegúrate de que está configurado correctamente
import "./Micro.scss";

const Micro = () => {
  const { openSidebar } = useContext(SidebarContext);
  const [challenges, setChallenges] = useState([]);
  const [completedFilter, setCompletedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const challengesPerPage = 3; // Número de desafíos por página

  // Obtener los microdesafíos desde Supabase
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const { data, error } = await supabase2
          .from("microdesafios")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setChallenges(data);
      } catch (err) {
        console.error("Error fetching challenges:", err);
      }
    };

    fetchChallenges();
  }, []);

  // Filtrar los desafíos según el estado (pendientes, completados o todos)
  const filteredChallenges = challenges.filter((challenge) => {
    if (completedFilter === "all") return true;
    return completedFilter === "completed" ? challenge.completed : !challenge.completed;
  });

  // Calcular las páginas
  const totalPages = Math.ceil(filteredChallenges.length / challengesPerPage);
  const startIndex = (currentPage - 1) * challengesPerPage;
  const paginatedChallenges = filteredChallenges.slice(startIndex, startIndex + challengesPerPage);

  const handleComplete = async (id) => {
    try {
      // Actualizar la base de datos
      const { data, error } = await supabase2
        .from("microdesafios")
        .update({ completed: true })
        .eq("id", id)
        .single(); // Obtiene solo el desafío actualizado

      if (error) throw error;

      // Actualizar el estado localmente para reflejar el cambio
      setChallenges((prev) =>
        prev.map((challenge) =>
          challenge.id === id ? { ...challenge, completed: true } : challenge
        )
      );
    } catch (err) {
      console.error("Error marking as complete:", err);
    }
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
