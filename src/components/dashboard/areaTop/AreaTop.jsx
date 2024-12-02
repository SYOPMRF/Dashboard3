import { MdOutlineMenu } from "react-icons/md";
import "./AreaTop.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { SidebarContext } from "../../../context/SidebarContext";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays } from "date-fns";
import { DateRange } from "react-date-range";
import { db } from "../../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const AreaTop = () => {
  const { openSidebar } = useContext(SidebarContext);

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateRangeRef = useRef(null);
  const [userName, setUserName] = useState(""); // Estado para el nombre del usuario

  const handleInputClick = () => {
    setShowDatePicker(true);
  };

  const handleClickOutside = (event) => {
    if (dateRangeRef.current && !dateRangeRef.current.contains(event.target)) {
      setShowDatePicker(false);
    }
  };

  useEffect(() => {
    // Listener para cerrar el selector de rango de fechas
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Buscamos usuarios con el campo `online` como true en la colección `registro`
    const fetchOnlineUser = async () => {
      try {
        const q = query(collection(db, "registro"), where("online", "==", true));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Tomamos el primer usuario encontrado
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          setUserName(userData.nombre || "Usuario");
        } else {
          setUserName(""); // No hay usuarios en línea
        }
      } catch (error) {
        console.error("Error al buscar usuarios en línea:", error);
        setUserName(""); // En caso de error limpiamos el estado
      }
    };

    fetchOnlineUser();
  }, []);

  return (
    <section className="content-area-top">
      <div className="area-top-l">
        <button
          className="sidebar-open-btn"
          type="button"
          onClick={openSidebar}
        >
          <MdOutlineMenu size={24} />
        </button>
        <h2 className="area-top-title">
          {userName ? `Hola, ${userName}` : "Dashboard"}
        </h2>
      </div>
      <div className="area-top-r">
        <div
          ref={dateRangeRef}
          className={`date-range-wrapper ${
            !showDatePicker ? "hide-date-range" : ""
          }`}
          onClick={handleInputClick}
        >
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setState([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={state}
            showMonthAndYearPickers={false}
          />
        </div>
      </div>
    </section>
  );
};

export default AreaTop;
