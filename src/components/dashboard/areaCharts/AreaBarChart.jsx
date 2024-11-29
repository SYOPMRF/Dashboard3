import { useContext, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ThemeContext } from "../../../context/ThemeContext";
import { supabase2 } from "../../../supabase/supabase"; // Asegúrate de importar el cliente de Supabase
import { LIGHT_THEME } from "../../../constants/themeConstants";
import "./AreaCharts.scss";

const AreaBarChart = () => {
  const { theme } = useContext(ThemeContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Definir el user_id específico
  const userId = "a0cc675b-974a-4cd7-8347-f0987113f908"; // Cambia esto por el user_id que desees

  // Función para obtener los puntajes del backend
  const fetchScores = async () => {
    setLoading(true);
    try {
      // Obtenemos los datos de la tabla de puntajes para un user_id específico
      const response = await supabase2
        .from("user_game_progress")
        .select("user_id, score, created_at")
        .eq("user_id", userId) // Filtramos por el user_id específico
        .order("created_at", { ascending: false }); // Ordenamos por fecha (más recientes primero)

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { data: scoresData } = response;

      // Tomar los 5 puntajes más recientes
      const latestScores = scoresData.slice(0, 5);

      // Mapear los datos de los puntajes al formato que se necesita para el gráfico
      const formattedData = latestScores.map((scoreData) => ({
        month: scoreData.created_at.split("-")[1], // Usamos el mes (o cualquier otro dato que necesites)
        profit: scoreData.score, // Asumiendo que 'score' es el puntaje de ganancia
        loss: 0, // Si no tienes datos de 'loss', puedes asignarlo como 0
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error al obtener los puntajes:", error);
      alert("No se pudieron obtener los puntajes. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  const formatTooltipValue = (value) => {
    return `${value}k`;
  };

  const formatYAxisLabel = (value) => {
    return `${value}k`;
  };

  const formatLegendValue = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div className="bar-chart">
      <div className="bar-chart-info">
        <h5 className="bar-chart-title">Puntajes Históricos</h5>
        <div className="chart-info-data">
          <div className="info-data-text"></div>
        </div>
      </div>
      <div className="bar-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={200}
            data={data} // Usamos los datos filtrados
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 5,
            }}
          >
            <XAxis
              padding={{ left: 10 }}
              dataKey="month"
              tickSize={0}
              axisLine={false}
              tick={{
                fill: `${theme === LIGHT_THEME ? "#676767" : "#f3f3f3"}`,
                fontSize: 14,
              }}
            />
            <YAxis
              padding={{ bottom: 10, top: 10 }}
              tickFormatter={formatYAxisLabel}
              tickCount={6}
              axisLine={false}
              tickSize={0}
              tick={{
                fill: `${theme === LIGHT_THEME ? "#676767" : "#f3f3f3"}`,
              }}
            />
            <Tooltip
              formatter={formatTooltipValue}
              cursor={{ fill: "transparent" }}
            />
            <Legend
              iconType="circle"
              iconSize={10}
              verticalAlign="top"
              align="right"
              formatter={formatLegendValue}
            />
            <Bar
              dataKey="profit"
              fill="#ff0004"
              activeBar={false}
              isAnimationActive={false}
              barSize={24}
              radius={[4, 4, 4, 4]}
            />
            <Bar
              dataKey="loss"
              fill="#e3e7fc"
              activeBar={false}
              isAnimationActive={false}
              barSize={24}
              radius={[4, 4, 4, 4]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaBarChart;
