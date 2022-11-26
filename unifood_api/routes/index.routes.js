module.exports = app => {
    
    //var router = require("express").Router();
    const express = require("express");
    const rutasProtegidas = express.Router();
    const config = require("../config/config");
    const jwt = require('jsonwebtoken');

    app.set("llave", config.llave);
    
    rutasProtegidas.use((req, res, next) => {
        const token = req.headers["access-token"];
        if (token) {
            jwt.verify(token, app.get("llave"), (err, decoded) => {
                if (err) {
                    return res.status(500).send("token error");
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(500).send("token error");
        }
    });
    
    /*
    * RUTAS PARA EL ROL
    */
    const rol = require("../controllers/rol.controller.js");

    var router = require("express").Router();
    // Crear un nuevo Rol 
    router.post("/rol/crear", rol.create); //http://localhost:9595/unifood/rol

    // Recuperar todos los Roles
    router.get("/rol/listar", rol.findAll); //http://localhost:9595/unifood/roles/

    // Encontrar Rol por id
    router.get("/rol/:id",rutasProtegidas, rol.findOne); //http://localhost:9595/unifood/rol/[id]

    // Actualizar Rol por id
    router.put("/rol/:id",rutasProtegidas, rol.update); //http://localhost:9595/unifood/rol/[id]

    // Eliminar un Rol por id
    router.delete("/rol/:id", rol.delete); //http://localhost:9595/unifood/rol/[id]

    // Eliminar todos los Roles de la base de datos
    router.delete("/rol/eliminar", rol.deleteAll); //http://localhost:9595/unifood/rolesALL/

    router.post("/registrarRol", rol.create);
    

    /**
     * RUTAS PARA EL USUARIO
     */
     const usuario = require("../controllers/usuario.controller.js");

     router.post("/usuario/crear", rutasProtegidas, usuario.create); //http://localhost:9595/unifood/usuario/crear
    
     router.get("/usuario/listar", usuario.findAll); //http://localhost:9595/unifood/usuario/listar
     
     router.get("/usuario/:id", usuario.findOne); //http://localhost:9595/unifood/usuario/1
     
     router.put("/usuario/:id", usuario.update); //http://localhost:9595/unifood/usuario/1
     
     router.delete("/usuario/:id", usuario.delete); //http://localhost:9595/unifood/usuario/1
     
     router.delete("/usuario/eliminar", usuario.deleteAll);
     
     router.post("/login", usuario.login); //http://localhost:9595/unifood/login
     
     router.post('/registrar', usuario.create); //http://localhost:9595/unifood/usuario/registrar


    /*
    * RUTAS PARA EL PRODUCTO
    */
    const producto = require("../controllers/producto.controller.js");

    // Crear un nuevo Producto 
    router.post("/producto/crear",rutasProtegidas, producto.create); //http://localhost:9595/unifood/producto/crear

    // Recuperar todos los Productos
    router.get("/producto/listar", producto.findAll); //http://localhost:9595/unifood/producto/listar

    // Encontrar Producto por nombre
    router.get("/producto/:prod_nombre", producto.findOne); //http://localhost:9595/unifood/producto/[prod_nombre]

    // Actualizar Rol por id
	router.put("/producto/:id", producto.update); //http://localhost:9595/unifood/producto/[id]

    // Eliminar un Producto por id
    router.delete("/producto/:id", producto.delete); //http://localhost:9595/unifood/producto/[id]

    // Eliminar todos los Productos de la base de datos
    router.delete("/producto/eliminar", producto.deleteAll); //http://localhost:9595/unifood/producto/eliminar

    router.post("/registrarProducto", producto.create);  //http://localhost:9595/unifood/registrarProducto


     app.use('/unifood', router);
};
