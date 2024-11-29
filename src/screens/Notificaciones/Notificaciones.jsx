import { useState, useEffect, useContext } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { SidebarContext } from "../../context/SidebarContext";
import { supabase2 } from "../../supabase/supabase";  // Asegúrate de que está configurado correctamente
import "./Notificaciones.scss";

const Notificaciones = () => {
  const { openSidebar } = useContext(SidebarContext);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  // Obtener las notificaciones desde Supabase
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase2
          .from("notificaciones")
          .select("id, title, message, is_read")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("No se pudo cargar las notificaciones.");
      }
    };

    fetchNotifications();
  }, []);

  // Marcar una notificación como leída
  const markAsRead = async (id) => {
    try {
      const { error } = await supabase2
        .from("notificaciones")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  // Eliminar una notificación
  const deleteNotification = async (id) => {
    try {
      const { error } = await supabase2
        .from("notificaciones")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  // Marcar todas como leídas (usando la misma lógica que para marcar una como leída)
  const markAllAsRead = async () => {
    try {
      // Recorremos todas las notificaciones para actualizarlas
      for (let notif of notifications) {
        if (!notif.is_read) {
          const { error } = await supabase2
            .from("notificaciones")
            .update({ is_read: true })
            .eq("id", notif.id);

          if (error) throw error;
        }
      }

      // Después de actualizar todas, reflejamos el cambio en el estado local
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
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
    <div style={{ textAlign: "center", padding: "20px" }}>
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
        Notificaciones
      </h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
        Aquí puedes gestionar tus notificaciones.
      </p>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={markAllAsRead}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#ff0004",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Marcar todo como leído
        </button>
        <button
          onClick={() => setNotifications([])}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#ff0004",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Eliminar todo
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              style={{
                width: "90%",
                maxWidth: "400px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                backgroundColor: notif.is_read ? "#fff" : "#f0f0f0",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    color: "#007bff",
                    margin: "0 0 5px",
                  }}
                >
                  {notif.title}
                </h3>
                <p style={{ fontSize: "1rem", color: "#555", margin: "0" }}>
                  {notif.message}
                </p>
              </div>
              <div>
                {!notif.is_read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    style={{
                      backgroundColor: "#fff",
                      color: "black",
                      border: "solid",
                      borderRadius: "5px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      marginRight: "5px",
                    }}
                  >
                    Leer
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notif.id)}
                  style={{
                    backgroundColor: "#ff0004",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ fontSize: "1.2rem", color: "#888" }}>
            No tienes notificaciones.
          </p>
        )}
      </div>
    </div>
  );
};

export default Notificaciones;
