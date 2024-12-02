// InicioSesion.jsx
import React, { useState } from "react";
import "./InicioSesion.scss"
import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

function InicioSesion() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const q = query(
        collection(db, "registro"),
        where("email", "==", formData.email),
        where("contraseña", "==", formData.password) // En producción, evita guardar contraseñas sin cifrar.
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "registro", userDoc.id), { online: true });
        alert("Inicio de sesión exitoso");
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión: ", error);
    }
  };

  return (
    <div className="inicio-sesion-container">
      <div className="image-section">
        <img src="https://cdn.pixabay.com/photo/2022/11/02/18/06/webcam-7565723_1280.png" alt="Plataforma de aprendizaje" />
      </div>
      <div className="form-section">
        <h1>Canvis</h1>
        <p>Inicia sesión para empezar a usar nuestros servicios</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Iniciar sesión</button>
        </form>
        <div className="button-group">
          <button onClick={() => (window.location.href = "/")}>Registrarse</button>
          <button onClick={() => (window.location.href = "/admin")}>Acceso administrativo</button>
        </div>
      </div>
    </div>
  );
}

export default InicioSesion;