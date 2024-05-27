import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Routes, useNavigate  } from 'react-router-dom';
import './css/canchas.css';


window.IdCancha = "";
export default function Canchas() {


    const navigate = useNavigate();
  
    const handleBasketCC = (event)=>{
    
      window.IdCancha = "1";
      navigate("/Horario");

    }
  
    const handleNatacionCC = (event)=>{
      window.IdCancha = "2";
      navigate("/Horario");
    }

    const handlePingpongCC = (event)=>{

        window.IdCancha = "3";
        navigate("/Horario");
      }

    const handleBadmintonCC = (event)=>{

        window.IdCancha = "4";
        navigate("/Horario");
      }

      const handleAjedrezSJ = (event)=>{
        window.IdCancha = "5";
        navigate("/Horario");
      }


      const handleSoccerSJ = (event)=>{
        window.IdCancha = "6";
        navigate("/Horario");
      }


      




  return (

    
    <div>


       <header>
        <h1 class="">Canchas USM</h1>


        </header>
    <main>
    
      <div class="container">
          
        <div>
  
          <h1 class="font">Canchas</h1>
  
          <button class="filter">filtrar</button>
    
        </div>
  
        <div class="caja">
          <h1 class="font">Casa Central</h1>
                <div>
        
                            <div class="header">
                
                            <button class="B1"  onClick={handleBasketCC}></button>
                
                            </div>
                            <div class="header">
                
                            <button class="B2"onClick={handleNatacionCC}></button>
                            
                            </div>
        
                
                            <div class="header">
                
                            <button class="B3" onClick={handlePingpongCC}></button>
                            
                            </div>
                
                            <div>
                
                                    <div class="header">
                        
                                        <button class="B4"  onClick={handleBadmintonCC}></button>
                            
                                    </div>
                            </div>
        
                </div>
        </div>
  
  
        <div class="caja">
          <h1 class="font">San Joaquín</h1>
          <div>
  
            <div class="header">
  
              <button class="B5" onClick={handleAjedrezSJ}></button>
  
            </div>
            <div class="header">
  
            <button class="B6"  onClick={handleSoccerSJ}></button>
            
            </div>
  
  
          </div>
        </div>
  
        <div class="caja">
          <h1 class="font">Vitacura</h1>
          <div>
  
            <div class="header">
  
              <h2>No existe</h2>
  
            </div>
  
  
  
          </div>
        </div>
         
      </div>
    </main>
  </div>


  )
}
