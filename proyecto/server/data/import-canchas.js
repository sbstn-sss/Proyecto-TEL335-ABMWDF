const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Cancha = require('../models/cancha');



dotenv.config({ path: '../.env' }); // with this command we read the .env file to extract and set env vars
//setted before because app use env variables

const canchas = JSON.parse(fs.readFileSync(`${__dirname}/canchas.json`, 'utf-8'));

mongoose
.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("DB CONNECTED"))
.catch((err) => console.log("DB CONNECTION ERROR", err));


const importData = async () => {
  try {
    await Cancha.create(canchas);

    console.log('Data successfully loaded');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete ALL DATA 
const deleteData = async () => {
  try {
    await Cancha.deleteMany();


    console.log('Data successfully deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData(); // si el comando de ejecucion es node {filename js} --import
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
