import { useState, useEffect } from "react";
import { supabase2 } from "../../../supabase/supabase"; // Asegúrate de importar el cliente de Supabase

const AreaProgressChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Definir el user_id específico
  const userId = "a0cc675b-974a-4cd7-8347-f0987113f908"; // Cambia esto por el user_id que desees

  // Función para obtener los datos del backend
  const fetchData = async () => {
    setLoading(true);
    try {
      // Obtenemos los datos de puntajes de usuario ordenados por fecha (los más recientes primero)
      const response = await supabase2
        .from("user_game_progress") // Asegúrate de usar la tabla correcta
        .select("user_id, score, created_at") // Traemos las columnas necesarias
        .eq("user_id", userId) // Filtramos por el user_id específico
        .order("created_at", { ascending: false }); // Ordenamos por fecha, de más reciente a más antiguo

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { data: scoresData } = response;

      // Tomamos solo los 5 primeros puntajes más recientes
      const latestScores = scoresData.slice(0, 5);

      // Si no hay puntajes, mostrar un mensaje apropiado
      if (latestScores.length === 0) {
        setData([]);
        setLoading(false);
        return;
      }

      // Encontrar el puntaje máximo (para hacer la barra de progreso)
      const maxScore = Math.max(...latestScores.map(score => score.score));

      // Formatear los puntajes para ser mostrados como porcentaje
      const formattedData = latestScores.map((scoreData) => ({
        score: scoreData.score,
        percentValue: (scoreData.score / maxScore) * 100, // Convertir el puntaje a porcentaje
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      alert("No se pudieron obtener los datos. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Progreso del Usuario</h4>
      </div>
      <div className="progress-bar-list">
        {loading ? (
          <p>Cargando...</p> // Mostrar mensaje de carga si los datos están siendo cargados
        ) : (
          data?.map((progressbar, index) => (
            <div className="progress-bar-item" key={index}>
              <div className="bar-item-info">
                <p className="bar-item-info-name">Puntaje {index + 1}</p>
                <p className="bar-item-info-value">
                  {progressbar.score} - {progressbar.percentValue.toFixed(2)}%
                </p>
              </div>
              <div className="bar-item-full">
                <div
                  className="bar-item-filled"
                  style={{
                    width: `${progressbar.percentValue}%`, // Usamos el porcentaje para el ancho de la barra
                  }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AreaProgressChart;
