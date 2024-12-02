import { useContext, useEffect } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import BaseLayout from "./layout/BaseLayout";
import {Dashboard, Logros, Micro, Notificaciones, PageNotFound, TablaClasificacion} from "./screens";
import { supabase } from "./supabase/supabase";
import InicioSesion from "./screens/InicioSesion/InicioSesion";
import Registro from "./screens/Registro/Registro";
import AccesoAdmin from "./screens/Administrativo/AccesoAdmin";


function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // adding dark-mode class if the dark mode is set on to the body tag
  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

return (
    <>
      <Router>
        <Routes>
          <Route element={<BaseLayout />}>
            <Route path="/" element={<Registro />} />
            <Route path="/login" element={<InicioSesion />} />
            <Route path="/admin" element={<AccesoAdmin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/logros" element={<Logros />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
            <Route path="/tabla" element={<TablaClasificacion />} />
            <Route path="/desafios" element={<Micro />} />
            
          </Route>
        </Routes>

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
        >
          <img
            className="theme-icon"
            src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
          />
        </button>
      </Router>
    </>
  );
}

export default App;
