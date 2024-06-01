import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./css/horario.css";
import DatePicker from "react-multi-date-picker";


export default function Horario() {
    const location = useLocation();
    const nombre = location.pathname.split("/")[2];

    const [cancha, setCancha] = useState({});
    const [selectedButton, setSelectedButton] = useState({ day: '', index: -1 });
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [reservas, setReservas] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState('');
    const [calendarWeek, setCalendarWeek] = useState([]);

    useEffect(() => {
        const today = new Date();
        const diffToMonday = (today.getDay() === 0) ? 6 : today.getDay() - 1;
        const mondayDate = new Date(today);
        mondayDate.setDate(today.getDate() - diffToMonday);
        setSelectedWeek(formatDate(mondayDate));

        fetch(`http://127.0.0.1:8080/api/canchas/${nombre}`, {
            method: 'GET',
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
            <div className="Block" key={i}>{i * 2 + 1}-{i * 2 + 2}</div>
        ));
    };

    const handleDateChangeTest = (dates) => {
        if (dates && dates.length > 0) {
            const startDate = new Date(dates[0]);
            const startDay = startDate.getDay();
            const diffToMonday = startDay === 0 ? 1 : (1 - startDay);
            const mondayDate = new Date(startDate);
            mondayDate.setDate(startDate.getDate() + diffToMonday);  

            setSelectedWeek(formatDate(mondayDate));  
        }
    };

    const getWeekDays = (mondayDate) => {
        const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
        const dates = [];
        for (let i = 1; i < 6; i++) {
            const day = new Date(mondayDate);
            day.setDate(mondayDate.getDate() + i);
            dates.push(formatDate(day));
        }
        return weekDays.map((day, index) => ({ day, date: dates[index] }));
    };



    const mondayDate = new Date(selectedWeek.split('-').reverse().join('-'));
    const weekDays = getWeekDays(mondayDate);

    return (
        <div>
            <main>
                <div className="container">
                    <div>
                        <h1 className="font">{cancha.nombre}</h1>
                        <h1 className="font" style={{ marginLeft: '50px' }}>
                            {cancha.campus === "SJ" ? "Campus San Joaquin" : "Casa Central"}
                        </h1>
                        <h1>Reservas</h1>
                        <div className="caja">
                            <DatePicker
                                value={calendarWeek}
                                onChange={handleDateChangeTest}
                                range
                                weekPicker
                                format="DD-MM-YYYY"
                                mapDays={({ date }) => {
                                    let props = {};
                                    if (date.weekDay.index === 0 || date.weekDay.index === 6) {
                                        props.disabled = true;
                                    }
                                    return props;
                                }}
                            />
                        </div>

                        <div className="flex" style={{ columnGap: '10px' }}>
                            <div className="flex_Block">
                                Bloques de horario
                                {renderTimeBlocks()}
                            </div>
                            {weekDays.map(({ day, date }) => (
                                <div className="flex_inside" style={{ width: '100px' }} key={day}>
                                    {day}
                                    {renderButtons(date)}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        {selectedTime && selectedDay && (
                            <p>Horario seleccionado: {selectedDay} - {selectedTime}</p>
                        )}
                    </div>
                    <button type="submit" className="minecraft_button">Reservar</button>
                </div>
            </main>
        </div>
    );
}
