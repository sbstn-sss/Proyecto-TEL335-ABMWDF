import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./css/horario.css";

export default function Horario() {
    const location = useLocation();
    const nombre = location.pathname.split("/")[2];

    //console.log(nombre);

    const [cancha, setCancha] = useState([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:8080/api/canchas/${nombre}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(data => {
            // Actualiza el estado con los datos recibidos
            setCancha(data.data.cancha); // Asigna todo el objeto data.data
            //console.log(data.data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }, []);

      //console.log('cancha',cancha);

  return (
    <div>

 

  <main>
  
    <div className="container">
        
      <div >

        <h1 className="font">{cancha.nombre}</h1>
        
        <h1 className="font" style={{marginLeft: '50px'}}>{(cancha.campus === "SJ")?"Campus San Joaquin":"Casa Central"}</h1>
  
      <div>

      <div className="caja">
        <h1 className="font">Horario disponible Cancha</h1>
        <input type="week"/>

        </div>
        <div>

          <div className="flex">



            <div className="flex_Block">
                Bloques de horario
                <div className="Block">
                   1-2
                </div>
                <div className="Block">
                 2-3
                </div>
                <div className="Block">
                  3-4
                </div>
                <div className="Block">
                   4-5
                </div>
                <div className="Block">
                  5-6
                </div>
                <div className="Block">
                   6-7
                </div>
                <div className="Block">
                   7-8
                </div>
                <div className="Block">
                   8-9
                </div>
                <div className="Block">
                  9-10
                </div>
                <div className="Block">
                  10-11
                </div>
            </div>

            <div className="flex">




                <div className="flex_inside">
                    Lunes
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                </div>







                <div className="flex_inside">
                    Martes


                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                </div>







                <div className="flex_inside">
                    Miercoles


                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                </div>





                <div className="flex_inside">
                    Jueves


                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                </div>







                <div className="flex_inside">
                    Viernes


                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                    <div>
                        <button className="Green_Block"></button>
                    </div>
                </div>
            </div>




          </div>
          </div>


        </div>
      </div>

      <button type="submit" className="minecraft_button">Reservar</button>

    </div>
  </main>



    </div>
  )
}
