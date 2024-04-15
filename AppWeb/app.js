const koa = require ('koa')
const static = require('koa-static');
const path = require('path');
const render = require('koa-ejs');
const app = new koa();
const router = require('./routes/view_routes.js');

// uso de ruta public
app.use(static('./public'));

// renderizaado de vistas
render(app, {
    root: path.join(__dirname, 'views'),
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: false
});


app.use(router.routes());


app.listen(3000, ()=>{
    console.log('Aplicación para la base del proyecto.')
})