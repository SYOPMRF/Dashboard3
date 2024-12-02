import { useState, useEffect, useContext } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { SidebarContext } from "../../context/SidebarContext";
import { db } from "../../firebase/firebase"; // Configuración de Firebase Firestore
import { collection, query, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";
import { format } from "date-fns"; // Librería para formatear fechas
import "./Notificaciones.scss";

const Notificaciones = () => {
  const { openSidebar } = useContext(SidebarContext);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  // Obtener notificaciones desde Firestore
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const q = query(
          collection(db, "notificaciones"),
          orderBy("created_at", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedNotifications = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(fetchedNotifications);
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
      const notifRef = doc(db, "notificaciones", id);
      await updateDoc(notifRef, { is_read: true });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  // Eliminar una notificación (actualiza el campo is_visible a false)
  const deleteNotification = async (id) => {
    try {
      const notifRef = doc(db, "notificaciones", id);
      await updateDoc(notifRef, { is_visible: false });
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  // Marcar todas como leídas
  const markAllAsRead = async () => {
    try {
      for (let notif of notifications) {
        if (!notif.is_read) {
          const notifRef = doc(db, "notificaciones", notif.id);
          await updateDoc(notifRef, { is_read: true });
        }
      }
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  // Formatear la fecha para mostrarla
  const formatDate = (timestamp) => {
    if (!timestamp) return "Sin fecha";
    const date = timestamp.toDate(); // Convertir el timestamp de Firestore a un objeto Date
    return format(date, "dd/MM/yyyy HH:mm"); // Formato: día/mes/año hora:minuto
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

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
        {notifications.length > 0 ? (
          notifications
            .filter((notif) => notif.is_visible) // Filtrar las notificaciones visibles
            .map((notif) => (
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
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#888",
                      marginTop: "5px",
                    }}
                  >
                    Fecha: {formatDate(notif.created_at)}
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
