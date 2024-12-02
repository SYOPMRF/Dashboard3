// AccesoAdmin.jsx
import React, { useState } from "react";
import "./AccesoAdmin.scss";
import { db } from "./firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

function AccesoAdmin() {
  const [formData, setFormData] = useState({
    adminEmail: "",
    adminPassword: "",
    adminCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdminAccess = async (e) => {
    e.preventDefault();
    try {
      const q = query(
        collection(db, "registro"),
        where("adminCode", "==", formData.adminCode)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        alert("Acceso administrativo concedido");
      } else {
        alert("Código de administrador incorrecto");
      }
    } catch (error) {
      console.error("Error en acceso administrativo: ", error);
    }
  };

  return (
    <div className="admin-container">
      <div className="image-section">
        <img src="/path/to/your/image.jpg" alt="Acceso administrativo" />
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
          <input
            type="password"
            name="adminPassword"
            placeholder="Contraseña"
            value={formData.adminPassword}
            onChange={handleChange}
            required
          />
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
