import { useState, useContext } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { SidebarContext } from "../../context/SidebarContext";
import "./Notificaciones.scss";

const Notificaciones = () => {

  const { openSidebar } = useContext(SidebarContext);
  // Datos iniciales de las notificaciones
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Nueva tarea asignada", message: "Tienes una nueva tarea pendiente.", isRead: false },
    { id: 2, title: "¡Felicidades!", message: "Has ganado un logro: Explorador.", isRead: false },
    { id: 3, title: "Recordatorio", message: "Tu evaluación vence mañana.", isRead: false },
    { id: 4, title: "Actualización", message: "Se ha actualizado tu perfil exitosamente.", isRead: true },
  ]);

  // Marcar una notificación como leída
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  // Eliminar una notificación
  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // Marcar todas como leídas
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

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

      <div
        style={{
          marginBottom: "20px",
        }}
      >
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
                backgroundColor: notif.isRead ? "#fff" : "#fff",
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
                {!notif.isRead && (
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
