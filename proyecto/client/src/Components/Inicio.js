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

        <header>
        <h1 class="">Gestor canchas USM</h1>


        </header>


        <main>
        <div class="container">
            <h1 class = "font">Bienvenidos al gestor de canchas USM</h1>

            <button onClick={Pressed} class="button_inicio">Reserva de horarios</button>
        </div>
        </main>
        
    </div>
  )
}

export default Inicio;
