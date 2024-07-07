import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import './css/reserva.css';
import { useCookies } from 'react-cookie'; 

export default function Reserva() {
<<<<<<< Updated upstream
  const [reservas, setReservas] = useState([]);
  const [cookies] = useCookies(['jwt']);

  useEffect(() => {
    // Fetch the user's reservations
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
      })
      .catch(error => {
        console.error('Error fetching reservations:', error);
      });
  }, [cookies.jwt]);

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
          // Actualizar el estado local para reflejar la cancelación
          setReservas(prevReservas => prevReservas.filter(reserva => reserva._id !== reservationId));
          // Mostrar una notificación o mensaje de éxito
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
      {reservas.length > 0 ? reservas.map((reserva, index) => (
        <div className="caja" key={reserva.id}>
          <h1 className="font">Estado</h1>
          <div>
            <div className="header">
              <h1 className="font">Reserva {index + 1}:</h1>
              <h1 className={reserva.confirmed ? 'Confirm' : 'Pending'}>
                {reserva.confirmed ? 'Confirmada' : 'Por confirmar'}
              </h1>
              <button className="Cancel" onClick={() => handleCancel(reserva.id)}>Cancelar</button>
            </div>
            <div className="details">
              <p>Cancha: {reserva.id_cancha.nombre}</p>
              <p>Fecha: {new Date(reserva.fecha).toLocaleDateString()}</p>
              <p>Hora: {reserva.bloque}</p>
            </div>
          </div>
        </div>
      )) : (
        <p>No hay reservas disponibles.</p>
      )}
=======
  const [cookies, setCookie, removeCookie] = useCookies(['jwt', 'id_usuario', 'email', 'nombre', 'rol', 'tipo_usuario']);

  const getReservas = () => {


    fetch(`http://127.0.0.1:8080/api/users/reservas/mine`, {
      method: 'GET',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json',
      },
   })
    .then(response => response.json())
    .then(data => {

      var cont = 0;
        data.forEach(datos => {
          
          cont += 1;
          <div class="header">
            <h1 class="font">Reserva {cont}:</h1>
            <h1 class="Confirm">Por confirmar</h1>
            <h1 class="font">{datos.data.reservas.fecha}</h1>

            <button class="Cancel">Cancelar</button>

            <div class="Flex">


            </div>
          </div>

        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
   

  }


  return (
    <div>


      <div class="caja">
        <h1 class="font">Estado</h1>
        <div>
            {getReservas()}
         </div>  
      </div>
>>>>>>> Stashed changes
    </div>
  );
}

