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
            header: "Proyecto TEL335"
        });
    })
    .get('/acerca', async (ctx, next) => {
        await ctx.render('acerca', {
            title: "Acerca del Proyecto",
            header: "WEBOSFIRE"
        });
    })
    .get('/integrantes', async (ctx, next) => {
        await ctx.render('integrantes', {
            title: "Integrantes del Grupo",
            header: "WEBOSFIRE"
        }); 
    })
    .get('/cancha', async (ctx, next) => {
        await ctx.render('cancha', {
            title: "Cancha"
        });
    })




module.exports = router;