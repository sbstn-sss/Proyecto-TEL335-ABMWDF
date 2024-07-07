import React from 'react';
import { useCookies } from 'react-cookie'; 
import { BrowserRouter as Router, Route, Switch, Link, Routes, useNavigate  } from 'react-router-dom';

function Header() {
  const [cookies, setCookie, removeCookie] = useCookies(['jwt', 'id_usuario', 'email', 'nombre', 'rol', 'tipo_usuario']);

  const navigate = useNavigate();

  const Delete_Cookies = () => {
    // Aquí defines la acción que deseas ejecutar
    removeCookie('jwt', { path: '/' });
    removeCookie('id_usuario', { path: '/' });
    removeCookie('email', { path: '/' });
    removeCookie('nombre', { path: '/' });
    removeCookie('rol', { path: '/' });
    removeCookie('tipo_usuario', { path: '/' });
  
    fetch('http://127.0.0.1:8080/api/users/logout', {
      method: 'DELETE',
      credentials: 'include'
    }).then(response => {
      if (response.ok) {
        console.log('Logout successful');
      } else {
        console.error('Logout failed');
      }
    });
  
  };



  const Reservas = () => {

    if (cookies.tipo_usuario === "admin"){
    navigate(`/ReservaAdmin`);
    } else {

      navigate(`/Reserva`);

    }
   

  };



  return (
    <header>
      <nav>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', marginRight: '70px' }}>
            <h1>Gestor canchas USM</h1>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Link to="/">Inicio</Link>
              <Link to="/Acerca">Acerca de</Link>
              {!cookies.id_usuario ? <Link to="/Acceso">Acceso</Link> : null}
            </div>
          </div>
          {cookies.id_usuario ? (
            <div style={{ display: 'flex', flexDirection: 'row', borderStyle: 'solid', borderColor: '#f7ae00', borderWidth: '2px', padding: '10px', columnGap: '10px', alignItems: 'center' }}>
              <img style={{ width: '70px', height: '70px' }} src="images/default.jpg" alt="usuario" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{ color: '#f7ae00' }}>{cookies.nombre}</p>
                <p style={{ color: '#f7ae00' }}>{cookies.tipo_usuario}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', rowGap: '10px' }}>
                <button style={{ height: '20px', width: '100px', color: '#171717', backgroundColor: '#f7ae00', borderStyle: 'solid', borderWidth: '2px', borderColor: '#f7ae00' }} onClick={Reservas}>Mis Reservas</button>
                <button style={{ height: '20px', color: '#171717', backgroundColor: '#D60019', borderStyle: 'solid', borderStyle: 'none' }} onClick={Delete_Cookies}>Log Out</button>
              </div>
            </div>
          ) : null}
        </div>
      </nav>
    </header>
  );
}

export default Header;
