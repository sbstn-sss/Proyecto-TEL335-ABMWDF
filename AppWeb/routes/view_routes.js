'use strict'
const Router = require('koa-router', {
    title: "Proyecto TEL335"
});
const path = require('path');
const router = new Router();

// rutas de las vistas
router
    .get('/', async (ctx, next) => {
        await ctx.render('inicio', {
            title: "Gestor de Canchas USM",
            header: "Proyecto TEL335",
            header_class: "" // es para colocarle un efecto al header: (ej: el de webosfire con class= nombre-integrantes)
        });
    })
    .get('/acerca', async (ctx, next) => {
        await ctx.render('acerca', {
            title: "Acerca del Proyecto",
            header: "WEBOSFIRE",
            header_class: ""
        });
    })
    .get('/integrantes', async (ctx, next) => {
        await ctx.render('integrantes', {
            title: "Integrantes del Grupo",
            header: "WEBOSFIRE",
            header_class: "nombre-grupo"
        }); 
    })
    .get('/cancha', async (ctx, next) => {
        await ctx.render('cancha', {
            title: "Cancha",
            header: "Reserva de canchas",
            header_class: ""
        });
    })
    .get('/login', async (ctx, next) => {
        await ctx.render('login', {
            title: "Acceso USM",
            header: "Acceso USM",
            header_class: ""
        });
    })  



module.exports = router;