import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Routes, useNavigate  } from 'react-router-dom';
import './css/canchas.css';


window.IdCancha = "";
export default function Canchas() {

    const navigate = useNavigate();
  
    const [canchas, setCanchas] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8080/api/canchas/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        // Actualiza el estado con los datos recibidos
        setCanchas(data.data.canchas);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);


    const handleButton = (nombre,event)=>{
      navigate(`/Canchas/${nombre}`);
    }
      




  return (

    
    <div>
    <main>
    
      <div className="container_can">
          
        <div style={{justifyContent: "space-between"}}>
  
          <h1>Canchas</h1>
    
        </div>
  


        <div className="caja_can">
          <h2>San Joaquín</h2>
          <div className='canchas_disp'>

            {canchas.map((cancha, index) => (
              <div className="header_can" key={index}>
                <p>{cancha.nombre}</p>
                <button
                  className="B5"
                  style={{
                    backgroundImage: `url(images/${cancha.photo})`,
                    // Otros estilos para el botón
                  }}
                  onClick={() => handleButton(cancha.slug)}
                ></button>
              </div>
            ))}
  
          </div>
        </div>
  
        
         
      </div>
    </main>
  </div>


  )
}
