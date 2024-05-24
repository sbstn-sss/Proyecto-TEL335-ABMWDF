const mongoose =require('mongoose');
const dotenv = require('dotenv');

// Global uncaught exception handler ( syncronous code )
process.on('uncaughtException', err => {
  console.log(
    'Uncaught exception: ',
    err.name,
    err.message,
    '\nShutting down...'
  );

  process.exit(1);
}); 

dotenv.config({ path: './.env' });

const app = require("./app");

// db
mongoose
.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("DB CONNECTED"))
.catch((err) => console.log("DB CONNECTION ERROR", err));




// port
const port = process.env.PORT || 8080;

//listener
const server = app.listen(port, () => 
    console.log(`Server funcionando en puerto ${port}`)
);



// Global rejected promises handler
process.on('unhandledRejection', err => {
  console.log(
    'Unhandled rejection: ',
    err.name,
    err.message,
    '\nApagando ...'
  );

  // Se ejecutan todas las promesas pendientes y se cierra el programa. Esto para errores graves en donde la ejecucion del programa ya no  es posible
  server.close(() => {
    process.exit(1);
  }); // code 0: success, code 1: uncaught exception
});
