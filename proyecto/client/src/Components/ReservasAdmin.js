import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import './css/reserva.css';

export default function ReservaAdmin() {
  const [cookies] = useCookies(['jwt']);
  const [reservas, setReservas] = useState([]);

  const hoy = new Date();
  const dia = hoy.getDate();
  const mes = hoy.getMonth() + 1; 
  const año = hoy.getFullYear();

  //const d = dia < 10 ? "0" + dia.toString() : dia.toString();
  const m = mes < 10 ? "0" + mes.toString() : mes.toString();
  const a = año.toString();
  const d = "08";

  useEffect(() => {
    // Fetch the user's reservations
    fetch('http://127.0.0.1:8080/api/canchas/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${cookies.jwt}`
      }
    })
    .then(response => response.json())
    .then(data => {
      data.data.canchas.forEach(element => {
        var res = element.nombre.toLowerCase();
        get_reservas_al_dia(res);
        alert(res);
      });
       // Si("cancha-de-futbol-2");
    })
    .catch(error => {
      console.error('Error fetching reservations:', error);
    });
  }, [cookies.jwt]);

  const get_reservas_al_dia = (Id_Canchas) => {
    fetch(`http://127.0.0.1:8080/api/reservas/${Id_Canchas}/${d}-${m}-${a}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${cookies.jwt}`
      }
    })
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => {

      if(data != null){
      //setReservas(data.reservas);
      alert(data.data.reserva.rol);
      }
    })
    .catch(error => {
      console.error('Error al cancelar la reserva:', error);
    });
  };

  return (
    <div className="container">
      {reservas.length > 0 ? reservas.map((reserva, index) => (
        <div className="caja" key={index}>
          <h1 className="font">Estado</h1>
          <div>
            <div className="header">
              <h1 className="font">Reserva {index}:</h1>
            </div>
            <div className="details">
              <p>Cancha: {reserva.id_cancha}</p>
              <p>Fecha: {reserva.dia_reservado}</p>
              <p>Hora: {reserva.bloque}</p>
            </div>
          </div>
        </div>
      )) : (
        <p>No hay reservas disponibles.</p>
      )}
    </div>
  );
}
