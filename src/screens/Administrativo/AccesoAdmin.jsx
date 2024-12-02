import React, { useState } from "react";
import "./AccesoAdmin.scss";
import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

// Si deseas usar un icono de FontAwesome, asegúrate de tenerlo instalado:
// npm install react-icons
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Iconos de FontAwesome

function AccesoAdmin() {
  const [formData, setFormData] = useState({
    adminEmail: "",
    adminPassword: "",
    adminCode: "",
    recoveryEmail: "", // Para el correo de recuperación
  });

  const [passwordVisible, setPasswordVisible] = useState(false); // Estado para mostrar/ocultar la contraseña
  const [isRecovery, setIsRecovery] = useState(false); // Estado para ver si el usuario está en la vista de recuperación

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdminAccess = async (e) => {
    e.preventDefault();
    try {
      // Validar que el correo tenga el dominio gmail.com
      const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!emailPattern.test(formData.adminEmail)) {
        alert("Por favor ingresa un correo válido de Gmail.");
        return;
      }

      // Buscar el usuario con el correo y código de administrador
      const q = query(
        collection(db, "registro"),
        where("adminCode", "==", formData.adminCode),
        where("adminEmail", "==", formData.adminEmail),
        where("adminPassword", "==", formData.adminPassword)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        // Verificar si el usuario tiene permisos de administrador
        if (userData.is_Admin) {
          // Actualizar el campo "online" del usuario a true
          await updateDoc(doc(db, "registro", userDoc.id), {
            online: true,
          });
          alert("Acceso administrativo concedido");
        } else {
          alert("No tienes permisos administrativos");
        }
      } else {
        alert("Datos de acceso incorrectos");
      }
    } catch (error) {
      console.error("Error en acceso administrativo: ", error);
      alert("Ocurrió un error al intentar acceder.");
    }
  };

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handlePasswordRecovery = async (e) => {
    e.preventDefault();
    try {
      // Validar que el correo tenga el dominio gmail.com
      const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!emailPattern.test(formData.recoveryEmail)) {
        alert("Por favor ingresa un correo válido de Gmail.");
        return;
      }

      // Buscar el correo en Firestore
      const q = query(
        collection(db, "registro"),
        where("recoveryEmail", "==", formData.recoveryEmail)

      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        // Recuperar la contraseña y enviarla (en este caso solo la mostramos)
        alert(`La contraseña es: ${userData.adminPassword}`);

      } else {
        alert("Correo no encontrado en la base de datos.");
      }
    } catch (error) {
      console.error("Error al recuperar la contraseña: ", error);
      alert("Ocurrió un error al intentar recuperar la contraseña.");
    }
  };

  return (
    <div className="admin-container">
      <div className="image-section">
        <img src="https://cdn.pixabay.com/photo/2022/11/02/18/06/webcam-7565723_1280.png" alt="Acceso administrativo" />
      </div>
      <div className="form-section">
        <h1>Acceso administrativo</h1>
        <form onSubmit={handleAdminAccess}>
          <input
            type="email"
            name="adminEmail"
            placeholder="Correo administrativo"
            value={formData.adminEmail}
            onChange={handleChange}
            required
          />
          
          <div className="password-input-container">
            <input
              type={passwordVisible ? "text" : "password"} // Cambia entre texto claro y cifrado
              name="adminPassword"
              placeholder="Contraseña"
              value={formData.adminPassword}
              onChange={handleChange}
              required
            />
            <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>
              {passwordVisible ? <FaEyeSlash /> : <FaEye />} {/* Muestra icono de ojo según el estado */}
            </button>
          </div>

          <input
            type="text"
            name="adminCode"
            placeholder="Código de administrador"
            value={formData.adminCode}
            onChange={handleChange}
            required
          />
          
          <button type="submit">Acceder</button>
        </form>

        {/* Botón "Olvidaste tu contraseña" */}
        <button className="auth-button" onClick={() => setIsRecovery(true)}>
          Olvidaste tu contraseña
        </button>

        {/* Recuperación de contraseña */}
        {isRecovery && (
          <form onSubmit={handlePasswordRecovery}>
            <input
              type="email"
              name="recoveryEmail"
              placeholder="Ingresa tu correo"
              value={formData.recoveryEmail}
              onChange={handleChange}
              required
            />
            <button type="submit">Recuperar contraseña</button>
          </form>
        )}

        {/* Botones para volver al registro o iniciar sesión */}
        <div className="auth-options">
          <button className="auth-button" onClick={() => window.location.href = "/"}>Volver al registro</button>
          <button className="auth-button" onClick={() => window.location.href = "/login"}>Iniciar sesión</button>
        </div>
      </div>
    </div>
  );
}

export default AccesoAdmin;
