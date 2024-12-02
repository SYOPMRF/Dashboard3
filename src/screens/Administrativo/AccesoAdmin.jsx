import React, { useState } from "react";
import "./AccesoAdmin.scss";
import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// Si deseas usar un icono de FontAwesome, asegúrate de tenerlo instalado:
// npm install react-icons

import { FaEye, FaEyeSlash } from "react-icons/fa"; // Iconos de FontAwesome

function AccesoAdmin() {
  const [formData, setFormData] = useState({
    adminEmail: "",
    adminPassword: "",
    adminCode: "",
  });
  
  const [passwordVisible, setPasswordVisible] = useState(false); // Estado para mostrar/ocultar la contraseña

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdminAccess = async (e) => {
    e.preventDefault();
    try {
      const q = query(
        collection(db, "registro"),
        where("adminCode", "==", parseInt(formData.adminCode, 10)),
        where("adminEmail", "==", formData.adminEmail),
        where("adminPassword", "==", formData.adminPassword)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        if (userDoc.is_Admin) {
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
      </div>
    </div>
  );
}

export default AccesoAdmin;
