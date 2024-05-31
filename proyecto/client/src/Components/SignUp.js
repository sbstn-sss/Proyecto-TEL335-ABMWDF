import React, { useState } from 'react';
import './css/signup.css';
import { BrowserRouter as Router, Route, Switch, Link, Routes, useNavigate  } from 'react-router-dom';


export default function SignUp() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [Cpassword, setCPassword] = useState('');
    const [Rol, setRol] = useState('');
    const navigate = useNavigate();

  
    const handlepassword = (event)=>{
      setPassword(event.target.value);
    }
  
    const handleEmail = (event)=>{
      setEmail(event.target.value);
    }

    const handleName = (event)=>{
        setName(event.target.value);
      }

    const handleCpassword = (event)=>{
        setCPassword(event.target.value);
      }

      const handleRol = (event)=>{
        setRol(event.target.value);
      }

    const Pressed = () => {
        // Aquí defines la acción que deseas ejecutar

        if(name !== "" && email !== "" && password !== "" &&  Cpassword !=="" && Rol !== ""){

            if(password !== Cpassword){

                alert('Las contraseñas no coinciden. Vuela a intentar');
            }else{
                
                fetch('http://127.0.0.1:8080/api/users/signup', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "name": name,
                        "rol": Rol,
                        "email": email,
                        "password": password,
                        "passwordConfirm": Cpassword
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

                    navigate("/Acceso");


            }

        }else{
            alert("No pueden quedar casillas en blanco. Vuelva a introducir los datos nuevamente");

        }
    };
  
    const SignUp = (event)=>{
  
  
      navigate("/SignUp");
  
    }



  return (
    <div class="container">
    <span class="icon-close"><ion-icon name="close-sharp"></ion-icon></span>

    <div class="form-box login">
        <h2>Formulario de registro</h2>
        <form action="#">

            <div class="caja">
                <div class="caja">

                    <button type="submit" class="minecraft_button">Ingresar Foto</button>
        
                </div>
            </div>
            <div class="input-box">
                <span class="icon"><ion-icon name="mail-sharp"></ion-icon></span>
                <input type="text" value={name} onChange={handleName} required/>
                <label>Nombre Completo</label>
            </div>
            <div class="input-box">
                <span class="icon"><ion-icon name="mail-sharp"></ion-icon></span>
                <input type="email" value={email} onChange={handleEmail} required/>
                <label>Email</label>
            </div>
            <div class="input-box">
                <span class="icon"><ion-icon name="lock-closed-sharp"></ion-icon></span>
                <input type="password" value={password} onChange={handlepassword} required/>
                <label>Contraseña</label>
            </div>
            <div class="input-box">
                <span class="icon"><ion-icon name="lock-closed-sharp"></ion-icon></span>
                <input type="password" value = {Cpassword} onChange={handleCpassword} required/>
                <label> Confirme contraseña</label>
            </div>
            <div class="input-box">
                <span class="icon"><ion-icon name="lock-closed-sharp"></ion-icon></span>
                <input type="text" value={Rol} onChange={handleRol} required/>
                <label> Ingrese Rol USM</label>
            </div>

            <button type="submit" class="minecraft_button" onClick={Pressed}>Registrar</button>

        </form>
    </div>

    </div>

  )
}
