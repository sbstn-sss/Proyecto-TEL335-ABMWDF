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

  var d = dia < 10 ? "0" + dia.toString() : dia.toString();
  var m = mes < 10 ? "0" + mes.toString() : mes.toString();
  var a = año.toString();

  const actualizarReserva = (idReserva) => {
    const url = `http://127.0.0.1:8080/api/reservas/${idReserva}`;
  
    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.jwt}`  // Suponiendo que tienes un token JWT almacenado en cookies
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        console.log('Reserva actualizada:', data);
        window.location.reload();
      } else {
        console.log('Error al actualizar la reserva:', data);
      }
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
    });
  };

  useEffect(() => {
    fetchCanchasAndReservas();
  }, [cookies.jwt]);

  const fetchCanchasAndReservas = () => {
    fetch(`http://127.0.0.1:8080/api/reservas/dia/${d}-${m}-${a}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${cookies.jwt}`
      }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success' && data.data && data.data.reservas) {
            setReservas(data.data.reservas);
        } else {
            console.log('No hay reservas disponibles o la respuesta no tiene el formato esperado.');
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

          <div className="reserva-box">

            <h5 className="Space">Rol </h5>
            <h5 className="Space">Cancha </h5>
            <h5 className="Space">Bloque </h5>
            <h5 className="Space">Estado </h5>

          </div>

          {reservas.map((reserva, index) => (
            <div className="reserva-box" key={reserva._id}>
              <h4 >{reserva.rol}</h4>
              <h4 >{reserva.id_cancha.nombre}</h4>
              <h4 >{reserva.bloque}</h4>
              {(() => {
                if (reserva.estado == "confirmada") {
                  return <h4 style={{ color: "#33ff33", fontWeight: 'normal' }}>Confirmada</h4>
                } else if (reserva.estado == "sin-confirmar" && reserva.activa) {
                  return  <button className='Confirm' onClick={() => actualizarReserva(reserva._id)}>Confirmar</button>
                } else {
                  return  <h4 style={{ color: "#d60019", fontWeight: 'normal' }}>Cancelada</h4>
                }
              })()}
            </div>
          ))}
        </div>
      ) : (
        <p>No hay reservas disponibles.</p>
      )}
    </div>
  );
}