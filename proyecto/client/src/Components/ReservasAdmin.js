import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import './css/admin.css';

export default function ReservaAdmin() {
  const [cookies] = useCookies(['jwt']);
  const [reservas, setReservas] = useState([]);

  const hoy = new Date();
  const dia = hoy.getDate();
  const mes = hoy.getMonth() + 1; 
  const año = hoy.getFullYear();

  const d = dia < 10 ? "0" + dia.toString() : dia.toString();
  const m = mes < 10 ? "0" + mes.toString() : mes.toString();
  const a = año.toString();

  useEffect(() => {
    fetch('http://127.0.0.1:8080/api/canchas/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${cookies.jwt}`
      }
    })
    .then(response => response.json())
    .then(data => {
      // Usar un Set para evitar duplicados
      const uniqueReservas = new Set();

      const fetchReservations = data.data.canchas.map(element => {
        const res = element.nombre.toLowerCase();
        return get_reservas_al_dia(res, uniqueReservas);
      });

      // Esperar a que todas las peticiones se completen
      Promise.all(fetchReservations).then(() => {
        // Convertir el Set a un array de objetos y actualizar el estado
        const reservasArray = Array.from(uniqueReservas).map(reservaString => JSON.parse(reservaString));
        setReservas(reservasArray);
      });
    })
    .catch(error => {
      console.error('Error fetching reservations:', error);
    });
  }, [cookies.jwt]);

  const get_reservas_al_dia = (Id_Canchas, uniqueReservas) => {
    return fetch(`http://127.0.0.1:8080/api/reservas/${Id_Canchas}/${d}-${m}-${a}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${cookies.jwt}`
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.data.reservas.length > 0) {
        data.data.reservas.forEach(reserva => {
          uniqueReservas.add(JSON.stringify(reserva)); // Convertir a string para evitar duplicados
        });
      }
    })
    .catch(error => {
      console.error('Error fetching reservations:', error);
    });
  };

  return (
    <div className="container">
      {reservas.length > 0 ? reservas.map((reserva, index) => (
        <div className="caja" key={index}>
          <h1 className="font">Estado</h1>
          <div>
            <div className="header">
              <h5 className="font">Reserva {index + 1}:</h5>
              <h5 className="font">Reserva {index + 1}:</h5>
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
