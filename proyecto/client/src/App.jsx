import './App.css';
import { useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Switch, Link, Routes} from 'react-router-dom';
import { Cookies, CookiesProvider, useCookies } from 'react-cookie'
// functions

import Log from './Components/Log';
import Inicio from './Components/Inicio';
import SignUp from './Components/SignUp';
import Canchas from './Components/Canchas';
import Horario from './Components/Horario';
import Header from './Components/header';

/*Variale global*/ 
// colores usm azuL: #004B85 / verde: #008452 / rojo: #D60019 / amarillo: #F7AE00 / #000000

function App() {
  const [cookies] = useCookies(['jwt', 'id_usuario', 'email', 'nombre', 'rol', 'tipo_usuario']);
  console.log(cookies);
  return (
    
    <div className="App">


        <Router>
        <CookiesProvider>
          <Header cookies={cookies}/>
          <Routes>
            <Route path = "/" element={<Inicio/>}/>
            <Route path = "/Acceso" element={<Log/>}/>
            <Route path = "/SignUp" element={<SignUp/>}/>
            <Route path = "/Canchas" element={<Canchas/>}/>
            <Route path = "/Canchas/:nombre" element={<Horario/>}/>
            
          </Routes>
        </CookiesProvider>
        </Router>

        

    </div>






  );
}

export default App;
