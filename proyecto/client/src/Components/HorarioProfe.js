import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./css/horario.css";
import DatePicker from "react-multi-date-picker";
import { Cookies, CookiesProvider, useCookies } from 'react-cookie';
import { BrowserRouter as Router, Route, Switch, Link, Routes, useNavigate  } from 'react-router-dom';


export default function Horario() {

    const navigate = useNavigate();
    const location = useLocation();
    const nombre = location.pathname.split("/")[2];

    const [cancha, setCancha] = useState({});
    const [selectedButton, setSelectedButton] = useState({ day: '', index: -1 });
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [reservas, setReservas] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState('');
    const [calendarWeek, setCalendarWeek] = useState([]);
    const [cookies] = useCookies(['jwt', 'id_usuario', 'email', 'nombre', 'rol', 'tipo_usuario']);


    useEffect(() => {
        const mondayDate = '05-08-2024';


        setSelectedWeek(mondayDate);

        fetch(`http://127.0.0.1:8080/api/canchas/${nombre}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            setCancha(data.data.cancha);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [nombre]);

    useEffect(() => {
        if (selectedWeek) {
            fetchReservasForWeek();
        }
    }, [selectedWeek]);

    const fetchReservasForWeek = () => {
        const url = `http://127.0.0.1:8080/api/reservas/${nombre}/semana/${selectedWeek}`;
        fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
               
            },
        })
        .then(response => response.json())
        .then(data => {
            setReservas(data.data.reservas);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const day = (`0${d.getDate()}`).slice(-2);
        const month = (`0${d.getMonth() + 1}`).slice(-2);
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleButtonClick = (day, index) => {
        setSelectedButton({ day, index });
        setSelectedDay(day);
        setSelectedTime(`${index * 2 + 1}-${index * 2 + 2}`);
    };

    const isReserved = (day, index) => {
        const block = `${index * 2 + 1}-${index * 2 + 2}`;
        return reservas.some(reserva => reserva.dia_reservado === day && reserva.bloque === block);
    };

    const renderButtons = (day) => {
        return Array.from({ length: 10 }, (_, index) => (
            <div key={index}>
                <button
                    className={isReserved(day, index) ? 'Red_Block' : (selectedButton.day === day && selectedButton.index === index ? 'Orange_Block' : 'Green_Block')}
                    onClick={() => handleButtonClick(day, index)}
                    disabled={isReserved(day, index)}
                ></button>
            </div>
        ));
    };

    const renderTimeBlocks = () => {
        return Array.from({ length: 10 }, (_, i) => (
            <div className="Block" key={i}> <p style={{fontSize:'medium'}}> {i * 2 + 1}-{i * 2 + 2}</p></div>
        ));
    };

    const getWeekDays = (mondayDate) => {
        const weekDays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
        const dates = [];
        for (let i = 1; i < 6; i++) {
            const day = new Date(mondayDate);
            day.setDate(mondayDate.getDate() + i);
            dates.push(formatDate(day));
        }
        return weekDays.map((day, index) => ({ day, date: dates[index] }));
    };

    const reservar = () => {
        
        
        if (!selectedTime || !selectedDay) {
            console.error("Seleccione un horario antes de reservar.");
            return;
        }
    
        const reservaData = {
            rol: cookies.rol,
            id_cancha: cancha.id, // Asumiendo que el ID de la cancha está en cancha._id
            bloque: selectedTime,
            dia_reservado: selectedDay,
            num_semanas: "18" // Asumiendo que el S2 dura 18 semanas
        };
    
        fetch('http://127.0.0.1:8080/api/reservas', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.jwt}`
            },
            body: JSON.stringify(reservaData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al reservar.'); // Lanza un error si el estado de la respuesta no es ok
            }
            return response.json(); // Si la respuesta es exitosa, convierte la respuesta a JSON
        })
        .then(data => {
            // Aquí puedes realizar cualquier acción adicional después de una reserva exitosa, como mostrar un mensaje de éxito.
            if(data.status === "success"){
                console.log('Reserva exitosa', data);
                alert("Reserva de Bloques exitosa. Será redirigido al inicio.");
                navigate("/");
            } else {
                console.log('Error en su reserva:', data);
                alert(`Error al reservar:\n ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (!cookies.jwt) {
                alert("Necesita logearse para hacer una reserva.");
            }else{
                alert("Error al realizar la reserva. Por favor, inténtelo de nuevo.");
            }
        });
    };


    const mondayDate = new Date(selectedWeek.split('-').reverse().join('-'));
    const weekDays = getWeekDays(mondayDate);

    return (
        <div>
            <main>
                <div className="container">
                    <div>
                        <div className='head_hor'>
                            <h1 className="font">{cancha.nombre}</h1>
                            <h1 className="font" style={{ marginLeft: '50px' }}>
                                {cancha.campus === "SJ" ? "Campus San Joaquin" : "Casa Central"}
                            </h1>
                        </div>
                        <h1>Seleccion de Bloque</h1>
                        

                        <div className="flex" style={{ columnGap: '10px', padding: '20px' }}>
                            <div className="flex_Block">
                                <p style={{ marginLeft:'20px' }}> Bloques de horario </p>
                                {renderTimeBlocks()}
                            </div>
                            {weekDays.map(({ day, date }) => (
                                <div className="flex_inside" style={{ width: '100px', paddingBottom: '10px'}} key={day}>
                                    {day}
                                    {renderButtons(date)}
                                </div>
                            ))}
                        </div>

                        

                    </div>
                    <div className="bloques_display">
                        <div className='bloque_d'>
                            
                            <span className='xd'>Bloque Disponible:</span><div className="Green_Block_sim"></div>
                        </div>
                        <div className='bloque_d'>

                            <span className='xd'>Bloque Ocupado:</span><div className="Red_Block_sim"></div>
                        </div>
                        <div className='bloque_d'>

                            <span className='xd'>Bloque Seleccionado:</span><div className="Orange_Block_sim"></div>
                        </div>
                    </div>
                    <div>
                        {selectedTime && selectedDay && (
                            <p>Bloque seleccionado: {selectedTime} - Desde el {selectedDay}</p>
                        )}
                    </div>
                    <button type="button" className="minecraft_button" onClick={reservar}>Reservar</button>
                </div>
            </main>
        </div>
    );
}