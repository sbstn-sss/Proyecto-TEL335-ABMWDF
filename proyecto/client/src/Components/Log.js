import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Routes, useNavigate  } from 'react-router-dom';
import { useCookies } from 'react-cookie';
//import './css/login.css';


export default function Log() {

  const [cookies, setCookie] = useCookies(['jwt', 'id_usuario', 'email', 'nombre', 'rol', 'tipo_usuario']);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handlepassword = (event)=>{
    setPassword(event.target.value);
  }

  const handleEmail = (event)=>{
    setEmail(event.target.value);
  }

  const SignUp = (event)=>{


    navigate("/SignUp");

  }


  const Pressed = () => {
    // Aquí defines la acción que deseas ejecutar
    
  fetch('http://127.0.0.1:8080/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": email,
        "password": password
      }),
    })
      .then(response => response.json())
      .then(data => {
        // Maneja los datos recibidos
        //console.log(data.data);
        const {id, email, name, rol, role} = data.data.user;
        console.log(id, email, name, rol, role);

        setCookie('jwt', data.token, { path: '/' , sameSite: 'none', secure: true});
        setCookie('id_usuario', id, { path: '/' , sameSite: 'none', secure: true});
        setCookie('email', email, { path: '/' , sameSite: 'none', secure: true});
        setCookie('nombre', name, { path: '/' , sameSite: 'none', secure: true});
        setCookie('rol', rol, { path: '/' , sameSite: 'none', secure: true});
        setCookie('tipo_usuario', role, { path: '/' , sameSite: 'none', secure: true});
        console.log(cookies);
        navigate("/");

      })
      .catch(error => {
        // Maneja cualquier error
        console.error('Error:', error);
      });

  };


  return (
    <div>

        <link rel="stylesheet" href="./css/login.css"/>

        


        <div className="container">
            <span className="icon-close"><ion-icon name="close-sharp"></ion-icon></span>

            <div className="form-box login">
                <h2>Login</h2>
                <form action="#">
                    <div className="input-box">
                        <span className="icon"><ion-icon name="mail-sharp"></ion-icon></span>
                        <input type="email"  value = {email} onChange={handleEmail} required/>
                        <label>Email</label>
                    </div>
                    <div className="input-box">
                        <span className="icon"><ion-icon name="lock-closed-sharp"></ion-icon></span>
                        <input type="password" value = {password} onChange={handlepassword} required/>
                        <label>contraseña</label>
                    </div>
                    <div className="remember-forgot">
                        <label><input type="checkbox"/> Remember me</label>
                    </div>
                    <button type="submit" className="minecraft_button" onClick={Pressed} >Login</button>
                    <div className="login-register">
                        <p>¿No tienes cuenta? <button href="#" className="minecraft_button" onClick={SignUp}>registrarme</button></p>
                    </div>

                </form>
            </div>



        </div>

    </div>
  )
}
