import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import './css/reserva.css'; 


export default function Reserva() {
  const [reservas, setReservas] = useState([]);
  const [cookies] = useCookies(['jwt']);
  const [reservaAct, setReservaAct] = useState(null);

  const fetchReservas = () => {
    fetch('http://127.0.0.1:8080/api/users/reservas/mine', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${cookies.jwt}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setReservas(data.data.reservas);
        console.log(data.data.reservas);
      })
      .catch(error => {
        console.error('Error fetching reservations:', error);
      });
  };

  useEffect(() => {
    fetchReservas();
  }, [cookies.jwt]);

  useEffect(() => {
    const activeReserva = reservas.find(reserva => reserva.activa);
    setReservaAct(activeReserva);
    console.log(activeReserva);
  }, [reservas]);

  const handleCancel = (reservationId) => {
    fetch(`http://127.0.0.1:8080/api/reservas/${reservationId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${cookies.jwt}`
      }
    })
      .then(response => {
        if (response.ok) {
          fetchReservas();
          
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
      <h1>Tus Reservas</h1>
      <div className="caja_res">
        <h2>Estado</h2>
        {reservaAct ? (
          <div key={reservaAct.id}>
            <div className="header_res">
              <p className="font">Reserva Activa:</p>
              <p className={(reservaAct.estado === "confirmada") ? 'Confirm' : 'Pending'}>
                {reservaAct.confirmed ? 'Confirmada' : 'Por confirmar'}
              </p>
              <button className="Cancel" onClick={() => handleCancel(reservaAct.id)}>Cancelar</button>
            </div>
            <div className="details">
              <p>Cancha: {reservaAct.id_cancha.nombre}</p>
              <p>Fecha: {reservaAct.dia_reservado}</p>
              <p>Bloque: {reservaAct.bloque}</p>
            </div>
          </div>
        ) : (
          <p>Usted no tiene ninguna reserva activa.</p>
        )}

        <h2>Historial:</h2>
        {reservas.length > 0 ? reservas
          .filter(reserva => !reserva.activa)
          .map((reserva, index) => (
            <div key={reserva.id}>
              <div className="header_res">
                <div>
                  <p>{reserva.id_cancha.nombre}</p>
                  <p>Fecha: {reserva.dia_reservado}</p>
                  <p>Bloque: {reserva.bloque}</p>
                </div>
                <div className='state-cancelar'>
                  <p className={(reserva.estado === "confirmada") ? 'Confirm_res' : 'Cancelada_res'}>
                    {(reserva.estado === "confirmada") ? 'Confirmada' : 'Cancelada'}
                  </p>
                </div>
              </div>
            </div>
          )) : (
          <p>Usted no tiene mas reservas registradas.</p>
        )}
      </div>

    </div>
  );
}
