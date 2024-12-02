import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from 'react-router-dom';
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import LogoBlue from "../../assets/images/logo_blue.svg";
import LogoWhite from "../../assets/images/logo_white.svg";
import {
  MdOutlineAttachMoney,
  MdOutlineBarChart,
  MdOutlineClose,
  MdOutlineCurrencyExchange,
  MdOutlineGridView,
  MdOutlineLogout,
  MdOutlineMessage,
  MdOutlinePeople,
  MdOutlineSettings,
  MdOutlineShoppingBag,
} from "react-icons/md";
import { Link } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";

import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

const Sidebar = () => {
  
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const location = useLocation(); // Obtiene la ubicación actual de la ruta
  const [activeLink, setActiveLink] = useState(location.pathname); // Sincroniza el estado con la ruta actual

  // closing the navbar when clicked outside the sidebar area
  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-oepn-btn"
    ) {
      closeSidebar();
    }
  };

  const handleLogout = async () => {
    try {
      // Crear una consulta para buscar al usuario con `online: true`
      const q = query(collection(db, "registro"), where("online", "==", true));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Si se encuentra el usuario, actualiza el campo `online` a `false`
        const userDoc = querySnapshot.docs[0]; // Suponiendo que solo hay un usuario online
        const userRef = doc(db, "registro", userDoc.id);
        await updateDoc(userRef, { online: false });

        console.log("Estado actualizado a offline.");
      } else {
        console.log("No se encontraron usuarios online.");
      }

      // Redirigir al usuario después de cerrar sesión
      handleRedirect();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Efecto para actualizar activeLink al cambiar la ruta
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src={theme === LIGHT_THEME ? LogoBlue : LogoWhite} alt="" />
          <span>
            Canvis
          </span>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar} aria-label="Cerrar barra lateral">
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className="menu-item">
            <Link to="/dashboard" className={`menu-link ${activeLink === "/dashboard" ? "active" : ""}`} onClick={() => setActiveLink("/dashboard")}>
              <span className="menu-link-icon">
                <MdOutlineGridView size={18} />
              </span>
              <span className="menu-link-text">Dashboard</span>
            </Link>
            </li>
            <li className="menu-item">
            <Link to="/logros" className={`menu-link ${activeLink === "/logros" ? "active" : ""}`} onClick={() => setActiveLink("/logros")}>
                <span className="menu-link-icon">
                  <MdOutlineBarChart size={20} />
                </span>
                <span className="menu-link-text">Logros</span>
              </Link>
            </li>
            <li className="menu-item">
            <Link to="/tabla" className={`menu-link ${activeLink === "/tabla" ? "active" : ""}`} onClick={() => setActiveLink("/tabla")}>
                <span className="menu-link-icon">
                  <MdOutlineAttachMoney size={20} />
                </span>
                <span className="menu-link-text">Tabla de Puntajes</span>
              </Link>
            </li>
            <li className="menu-item">
            <Link to="/notificaciones" className={`menu-link ${activeLink === "/notificaciones" ? "active" : ""}`} onClick={() => setActiveLink("/notificaciones")}>
                <span className="menu-link-icon">
                  <MdOutlineCurrencyExchange size={18} />
                </span>
                <span className="menu-link-text">Notificaciones</span>
              </Link>
            </li>
            <li className="menu-item">
            <Link to="/desafios" className={`menu-link ${activeLink === "/desafios" ? "active" : ""}`} onClick={() => setActiveLink("/desafios")}>
                <span className="menu-link-icon">
                  <MdOutlineCurrencyExchange size={18} />
                </span>
                <span className="menu-link-text">Desafíos</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
            <button className="menu-link" onClick={handleLogout}>
            <Link to="/" className={`menu-link ${activeLink === "/" ? "active" : ""}`} onClick={() => setActiveLink("/")}>
                <span className="menu-link-icon">
                  <MdOutlineLogout size={20} />
                </span>
                <span className="menu-link-text">Cerrar Sesión</span>
                </Link>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
