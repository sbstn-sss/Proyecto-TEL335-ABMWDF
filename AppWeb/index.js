const express = require ('express')
const app = express()
const routes = require('./routes/index.js')
const path = require ('path')

app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'public')));
app.use(routes)


app.listen(3000, ()=>{
    console.log('Aplicación para la base del proyecto.')
})