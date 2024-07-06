// import modules
const express = require('express');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const cookieParser = require('cookie-parser');



const userRouter = require('./routes/user_routes');
const canchaRouter = require('./routes/cancha_routes');
const reservaRouter = require('./routes/reserva_routes');
const globalErrorHandler = require('./controllers/errorController');

// app
const app = express();


// middleware
app.use(cookieParser());

app.use(morgan("dev"));
app.use(cors({origin: "http://localhost:3000", credentials: true}));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // limit of memory of the request body


// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// routes

//app.use((req,res,next) => {
//  console.log(req.cookies);
//  next();
//});


// usuarios
app.use('/api/users/', userRouter);

// canchas
app.use('/api/canchas/', canchaRouter);

// reservas
app.use('/api/reservas/', reservaRouter);


// canchas
// pendiente ( solo get )

// global error middleware

app.use(globalErrorHandler);

module.exports = app;