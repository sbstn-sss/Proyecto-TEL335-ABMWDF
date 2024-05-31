import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./css/horario.css";

export default function Horario() {
    const location = useLocation();
    const nombre = location.pathname.split("/")[2];

    //console.log(nombre);

    const [cancha, setCancha] = useState([]);

    //para los botones

    const [selectedButton, setSelectedButton] = useState({ day: '', index: -1 });

    const [reservas, setReservas] = useState([]);

    const [selectedWeek, setSelectedWeek] = useState('');

    useEffect(() => {
        fetch(`http://127.0.0.1:8080/api/canchas/${nombre}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(data => {
            // Actualiza el estado con los datos recibidos
            setCancha(data.data.cancha); // Asigna todo el objeto data.data
            //console.log(data.data.cancha);
          })
          .catch(error => {
            console.error('Error:', error);
          });
    }, [nombre]);

    //console.log('cancha',cancha);

    //busca las reservas en la bd
    useEffect(() => {
        if (selectedWeek) {
            const startDate = new Date(selectedWeek);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 4);

            fetchReservasForWeek(startDate, endDate);
        }
    }, [selectedWeek]);

    const fetchReservasForWeek = (startDate, endDate) => {
        const promises = [];

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const formattedDate = formatDate(d);
            const url = `http://127.0.0.1:8080/api/reservas/${nombre}/${formattedDate}`;
            promises.push(fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json()));
        }

        Promise.all(promises)
            .then(results => {
                const allReservas = results.flatMap(result => result.data.reservas);
                setReservas(allReservas);
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
    };

    //revisa si esta reservado
    const isReserved = (day, index) => {
        const block = `${index * 2 + 1}-${index * 2 + 2}`;
        return reservas.some(reserva => reserva.dia_reservado === day && reserva.bloque === block);
    };
    
    const renderButtons = (day) => {
        return Array.from({ length: 8 }, (_, index) => (
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
        return Array.from({ length: 8 }, (_, i) => (
            <div className="Block" key={i}>{i * 2 + 1}-{i * 2 + 2}</div>
        ));
    };

    const handleWeekChange = (e) => {
        setSelectedWeek(e.target.value);
    };

    return (
        <div>
            <main>
                <div className="container">
                    <div>
                        <h1 className="font">{cancha.nombre}</h1>
                        <h1 className="font" style={{ marginLeft: '50px' }}>
                            {cancha.campus === "SJ" ? "Campus San Joaquin" : "Casa Central"}
                        </h1>
                        <div className="caja">
                            <h1 className="font">Horario disponible Cancha</h1>
                            <input type="week" onChange={handleWeekChange} />
                        </div>
                        <div className="flex">
                            <div className="flex_Block">
                                Bloques de horario
                                {renderTimeBlocks()}
                            </div>
                            <div className="flex_inside">
                                Lunes
                                {renderButtons('Lunes')}
                            </div>
                            <div className="flex_inside">
                                Martes
                                {renderButtons('Martes')}
                            </div>
                            <div className="flex_inside">
                                Miércoles
                                {renderButtons('Miércoles')}
                            </div>
                            <div className="flex_inside">
                                Jueves
                                {renderButtons('Jueves')}
                            </div>
                            <div className="flex_inside">
                                Viernes
                                {renderButtons('Viernes')}
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="minecraft_button">Reservar</button>
                </div>
            </main>
        </div>
    );
}
