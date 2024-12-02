import React, { useState } from "react";
import "./Registro.scss";
import { db } from "../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import bcrypt from "bcryptjs"; // Importa bcryptjs para el cifrado
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Iconos de FontAwesome

function Registro() {
  const [formData, setFormData] = useState({
    nombre: "", // Campo para el nombre
    email: "",
    password: "",
    confirmPassword: "",
    recoveryEmail: "", // Campo para almacenar el correo de recuperación
  });

  const [passwordVisible, setPasswordVisible] = useState(false); // Para manejar la visibilidad de la contraseña

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validación de la contraseña
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  // Validación del correo electrónico (solo gmail.com)
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;  // Cambié la validación para aceptar solo @gmail.com
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    // Validar contraseña (debe cumplir con la regex)
    if (!validatePassword(formData.password)) {
      alert("La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.");
      return;
    }

    // Validar correo electrónico (solo gmail.com)
    if (!validateEmail(formData.email)) {
      alert("El correo electrónico debe ser de tipo gmail.com.");
      return;
    }

    try {
      // Cifrar la contraseña con bcryptjs
      const hashedPassword = bcrypt.hashSync(formData.password, 10); // 10 es el número de saltos para el cifrado

      // Guardar los datos en Firestore
      await addDoc(collection(db, "registro"), {
        nombre: formData.nombre, // Agregar el nombre
        email: formData.email,
        recoveryEmail: formData.recoveryEmail, // Guardar el correo de recuperación
        contraseña: hashedPassword, // Aquí se guarda la contraseña cifrada
        online: false,
      });

      alert("Registro completado");
    } catch (error) {
      console.error("Error al registrar: ", error);
    }
  };

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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
          {/* Campo para ingresar el nombre */}
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Campo para ingresar el correo de recuperación */}
          <input
            type="email"
            name="recoveryEmail"
            placeholder="Correo de recuperación"
            value={formData.recoveryEmail}
            onChange={handleChange}
            required
          />

          {/* Campo para la contraseña con opción para mostrarla u ocultarla */}
          <div className="password-input-container">
            <input
              type={passwordVisible ? "text" : "password"} // Cambia entre texto claro y cifrado
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>
              {passwordVisible ? <FaEyeSlash /> : <FaEye />} {/* Muestra icono de ojo según el estado */}
            </button>
          </div>

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
