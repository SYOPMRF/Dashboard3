// Registro.jsx
import React, { useState } from "react";
import "./Registro.scss";
import { db } from "../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

function Registro() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    try {
      await addDoc(collection(db, "registro"), {
        email: formData.email,
        password: formData.password, // ¡Cifra esto en una implementación real!
        online: false,
      });
      alert("Registro completado");
    } catch (error) {
      console.error("Error al registrar: ", error);
    }
  };

  return (
    <div className="registro-container">
      <div className="image-section">
        <img src="https://cdn.pixabay.com/photo/2022/11/02/18/06/webcam-7565723_1280.png" alt="Plataforma de aprendizaje" />
      </div>
      <div className="form-section">
        <h1>Canvis</h1>
        <p>Conéctate y gestiona tu aprendizaje de forma simple y colaborativa.</p>
        <p>Inicia sesión para empezar a usar nuestros servicios</p>
        <form onSubmit={handleSubmit}>
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Repetir contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit">Completar registro</button>
        </form>
        <p>¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></p>
      </div>
    </div>
  );
}

export default Registro;