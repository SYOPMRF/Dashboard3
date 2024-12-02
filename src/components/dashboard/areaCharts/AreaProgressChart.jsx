import { useState, useEffect } from "react";
import { db } from "../../../firebase/firebase"; // Asegúrate de importar tu configuración de Firebase
import { collection, getDocs, query, where } from "firebase/firestore";

const AreaProgressChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    try {
      // 1. Obtener todos los usuarios con `online: true` en la colección `registro`
      const registroRef = collection(db, "registro");
      const registroQuery = query(registroRef, where("online", "==", true));
      const registroSnapshot = await getDocs(registroQuery);

      if (registroSnapshot.empty) {
        console.log("No hay usuarios online.");
        setData([]);
        setLoading(false);
        return;
      }

      const emailsOnline = registroSnapshot.docs.map((doc) => doc.data().email);

      // 2. Buscar en `user_game_progress` los documentos cuyo `email` coincida
      const gameProgressRef = collection(db, "user_game_progress");
      const gameProgressQuery = query(gameProgressRef, where("email", "in", emailsOnline)); // Usamos "in" para filtrar múltiples emails
      const gameProgressSnapshot = await getDocs(gameProgressQuery);

      if (gameProgressSnapshot.empty) {
        console.log("No hay progresos de juego para los usuarios online.");
        setData([]);
        setLoading(false);
        return;
      }

      // 3. Extraer los campos necesarios (score)
      const progressData = gameProgressSnapshot.docs.map((doc) => ({
        score: doc.data().score,
      }));

      // 4. Ordenar por puntaje y tomar los primeros 5
      const sortedData = progressData.sort((a, b) => b.score - a.score).slice(0, 5);

      // Formatear los puntajes para mostrar como porcentaje
      const maxScore = Math.max(...sortedData.map((item) => item.score));
      const formattedData = sortedData.map((item) => ({
        score: item.score,
        percentValue: (item.score / maxScore) * 100,
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
  }, []); // Se ejecuta una vez al montar el componente

  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Progreso del Usuario</h4>
      </div>
      <div className="progress-bar-list">
        {loading ? (
          <p>Cargando...</p>
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
                    width: `${progressbar.percentValue}%`,
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
