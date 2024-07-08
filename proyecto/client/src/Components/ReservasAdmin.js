import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import './css/admin.css';

export default function ReservaAdmin() {
  const [cookies] = useCookies(['jwt', 'tipo_usuario']);
  const [reservas, setReservas] = useState([]);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (cookies.tipo_usuario !== 'admin') {
      if (!redirected) {
        alert('No tienes permisos de administrador.');
        setRedirected(true);
        window.location.href = '/';
      }
    } else {
      fetchCanchasAndReservas();
    }
  }, [cookies.role, redirected]);

  const fetchCanchasAndReservas = () => {
    fetch('http://127.0.0.1:8080/api/canchas/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${cookies.jwt}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setReservas([]);

      data.data.canchas.forEach(element => {
        fetchReservasForToday(element.slug);
      });
    })
    .catch(error => {
      console.error('Error fetching courts:', error);
    });
  };

  const fetchReservasForToday = (slugCancha) => {
    const hoy = new Date();
    const formatoFecha = (fecha) => {
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Mes empieza en 0
      const año = fecha.getFullYear();
      return `${dia}-${mes}-${año}`;
    };

    const fechaHoy = formatoFecha(hoy);
    const url = `http://127.0.0.1:8080/api/reservas/${slugCancha}/${fechaHoy}`;

    fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.jwt}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setReservas(prevReservas => [...prevReservas, ...data.data.reservas]);
    })
    .catch(error => {
      console.error(`Error fetching reservations for ${slugCancha} on ${fechaHoy}:`, error);
    });
  };

  const handleCancel = (reservationId) => {
    fetch(`http://127.0.0.1:8080/api/users/reservas/${reservationId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${cookies.jwt}`
      }
    })
    .then(response => {
      if (response.ok) {
        setReservas(prevReservas => prevReservas.filter(reserva => reserva._id !== reservationId));
        console.log('Reserva cancelada exitosamente');
      } else {
        console.error('Error al cancelar la reserva');
      }
    })
    .catch(error => {
      console.error('Error al cancelar la reserva:', error);
    });
  };

  return (
    <div className="container">
      <h1>Reservas Administrativas</h1>
      {reservas.length > 0 ? (
        <div className="reservas-grid">
          {reservas.map((reserva, index) => (
            <div className="reserva-box" key={index}>
              <h2 className="font">Reserva {index + 1}</h2>
              <p>Cancha: {reserva.id_cancha.nombre}</p>
              <p>Fecha: {reserva.dia_reservado}</p>
              <p>Hora: {reserva.bloque}</p>
              <button onClick={() => handleCancel(reserva._id)}>Cancelar Reserva</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay reservas disponibles.</p>
      )}
    </div>
  );
}