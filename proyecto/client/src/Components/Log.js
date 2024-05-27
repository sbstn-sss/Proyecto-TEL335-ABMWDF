import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Routes, useNavigate  } from 'react-router-dom';
import './css/login.css';


export default function Log() {

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
    
    if(password != "" && email != ""){
    alert("iniciando sesión");
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
          console.log(data);
        })
        .catch(error => {
          // Maneja cualquier error
          console.error('Error:', error);
        });

    }else{
        alert("ingresa datos válidos");

    }
  };


  return (
    <div>

        <link rel="stylesheet" href="css/login.css"></link>

        <header>
        <h1 class="">Login</h1>


        </header>


        <div class="container">
            <span class="icon-close"><ion-icon name="close-sharp"></ion-icon></span>

            <div class="form-box login">
                <h2>Login</h2>
                <form action="#">
                    <div class="input-box">
                        <span class="icon"><ion-icon name="mail-sharp"></ion-icon></span>
                        <input type="email"  value = {email} onChange={handleEmail} required/>
                        <label>Email</label>
                    </div>
                    <div class="input-box">
                        <span class="icon"><ion-icon name="lock-closed-sharp"></ion-icon></span>
                        <input type="password" value = {password} onChange={handlepassword} required/>
                        <label>contraseña</label>
                    </div>
                    <div class="remember-forgot">
                        <label><input type="checkbox"/> Remember me</label>
                    </div>
                    <button type="submit" class="minecraft_button" onClick={Pressed} >Login</button>
                    <div class="login-register">
                        <p>¿No tienes cuenta? <button href="#" class="minecraft_button" onClick={SignUp}>registrarme</button></p>
                    </div>

                </form>
            </div>



        </div>

    </div>
  )
}
