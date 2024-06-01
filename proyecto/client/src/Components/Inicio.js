import React from 'react';
import "./css/inicio.css";
import Log from './Log';
import { BrowserRouter as Router, Route, Switch, Link, Routes, useNavigate  } from 'react-router-dom';



 function Inicio() {

    const navigate = useNavigate();
    const Pressed = () => {
        // Aquí defines la acción que deseas ejecutar
        navigate("/Canchas");
      };
  return (
    <div>

        <main>
        <div className="container">
            <h1 className = "font">Bienvenidos al gestor de canchas USM</h1>

            <button onClick={Pressed} className="button_inicio">Reserva de horarios</button>
        </div>
        </main>
        
    </div>
  )
}

export default Inicio;
