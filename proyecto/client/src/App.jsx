import './App.css';
import { useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Switch, Link, Routes} from 'react-router-dom';


// functions
import {getTest} from "./functions/test";
import Log from './Components/Log';
import Inicio from './Components/Inicio';
import SignUp from './Components/SignUp';
import Canchas from './Components/Canchas';
import Horario from './Components/Horario';

/*Variale global*/ 


function App() {
  const [data, setData] = useState("Hello World!");

  useEffect(() => {
    getTest()
      .then((res) => {
        setData(res.message);
      })
      .catch((err) => console.log(err));
  }, []);
  
  return (
    
    <div className="App">


        <Router>
        <header>
        <nav>
            <Link to="/inicio">Inicio</Link>
            <Link to="/Acerca">Acerca de</Link>
            <Link to="/Acceso">Acceso</Link>
        </nav>
        </header>
        <Routes>
        <Route path = "/inicio" element={<Inicio/>}/>
        <Route path = "/" element={<Inicio/>}/>
        <Route path = "/Acceso" element={<Log/>}/>
        <Route path = "/SignUp" element={<SignUp/>}/>
        <Route path = "/Canchas" element={<Canchas/>}/>
        <Route path = "/Horario" element={<Horario/>}/>
        
        </Routes>
    
        </Router>

        

    </div>






  );
}

export default App;
