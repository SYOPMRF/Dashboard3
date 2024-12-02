import React, { useState } from "react";
import "./InicioSesion.scss";
import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import bcrypt from "bcryptjs"; // Importa bcryptjs para la verificación de la contraseña
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Iconos de FontAwesome

function InicioSesion() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false); // Para manejar la visibilidad de la contraseña
  const [recoveryEmail, setRecoveryEmail] = useState(""); // Para el correo de recuperación
  const [recoveryStatus, setRecoveryStatus] = useState(""); // Mensaje de estado de recuperación

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para manejar el inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const q = query(
        collection(db, "registro"),
        where("email", "==", formData.email)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const hashedPassword = userDoc.data().contraseña; // Obtén la contraseña cifrada de la base de datos

        // Verifica si la contraseña ingresada es la misma que la cifrada en la base de datos
        const passwordMatch = bcrypt.compareSync(formData.password, hashedPassword); // Compara la contraseña en texto claro con la cifrada
        if (passwordMatch) {
          await updateDoc(doc(db, "registro", userDoc.id), { online: true });
          alert("Inicio de sesión exitoso");
        } else {
          alert("Credenciales incorrectas");
        }
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión: ", error);
    }
  };

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Función para manejar la recuperación de contraseña
  const handlePasswordRecovery = async (e) => {
    e.preventDefault();
    setRecoveryStatus(""); // Limpiar el estado previo

    try {
      // Consultar si el correo existe en la base de datos
      const q = query(
        collection(db, "registro"),
        where("recoveryEmail", "==", recoveryEmail)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Enviar un correo de recuperación (usando EmailJS, por ejemplo)
        const userDoc = querySnapshot.docs[0].data();
        const password = userDoc.contraseña; // Obtener la contraseña cifrada desde la base de datos

        // Recuperar la contraseña y enviarla (en este caso solo la mostramos)
        alert(`La contraseña es: ${userDoc.contraseña}`);

        // Actualiza el estado para notificar al usuario
        setRecoveryStatus("Correo enviado correctamente.");
      } else {
        setRecoveryStatus("Este correo no está registrado.");
      }
    } catch (error) {
      console.error("Error en la recuperación de contraseña: ", error);
      setRecoveryStatus("Ocurrió un error al intentar recuperar la contraseña.");
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
          
          <button type="submit">Iniciar sesión</button>
        </form>

        <div className="button-group">
          <button onClick={() => (window.location.href = "/")}>Registrarse</button>
          <button onClick={() => (window.location.href = "/admin")}>Acceso administrativo</button>
        </div>

        <div className="recovery-section">
          <h3>¿Olvidaste tu contraseña?</h3>
          <form onSubmit={handlePasswordRecovery}>
            <input
              type="email"
              name="recoveryEmail"
              placeholder="Correo electrónico para recuperación"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              required
            />
            <button type="submit">Recuperar contraseña</button>
          </form>
          {recoveryStatus && <p className="recovery-status">{recoveryStatus}</p>}
        </div>
      </div>
    </div>
  );
}

export default InicioSesion;
