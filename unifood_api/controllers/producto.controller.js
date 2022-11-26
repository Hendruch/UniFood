const db = require("../models");
const config = require("../config/config");
const express = require("express");
const path = require('path');
const moment = require('moment');

const Producto = db.producto;
const app = express();
app.set("llave", config.llave);

// PROBAR ESTE CODIGO
/*
// Crear y Guardar un nuevo Producto
exports.create = (req, res) => {
  Producto.findOne({ where: { prod_nombre: req.body.prod_nombre } })
    .then(Producto => {
      // Validar request
      if (Producto) {
        res.status(400).send({
          mensaje: "Producto existente"
        });
        return;
      } else {

        const producto = {
            prod_nombre: req.body.prod_nombre,
            prod_precio: req.body.prod_precio,
            prod_categoria: req.body.prod_categoria,
            prod_descripcion: req.body.prod_descripcion
        };

        // Guardar Producto en la base de datos
        Producto.create(producto)
          .then(Producto => {
            res.status(200).send(Producto);
          })
          .catch(err => {
            // res.status(500).send({
            //   mensaje:
            //     err.message || "Ocurrio un error al crear Rol."
            // });
            //res.status(500).sendFile(path.join(__dirname, '../source/img', 'error.png'));
            res.status(500).send({mensaje: "Error al crear producto"});
          });
      }
    })
    .catch(err => {
      // res.status(500).send({
      //   mensaje: "Error al recuperar Producto por correo"
      // });
      res.status(500).sendFile(path.join(__dirname, '../source/img', 'error.png'));
    });
};
*/


exports.create = (req, res) => {
  // Validar request
  if (!req.body.prod_nombre) {
    res.status(400).send({
      message:
        "El contenido no puede ser vacio, nombre=" +
        req.body.prod_nombre +
        "precio=" +
        req.body.prod_precio,
    });
    return;
  }
  // Crear un Rol
  const producto = {
    prod_nombre: req.body.prod_nombre,
    prod_precio: req.body.prod_precio,
    prod_categoria: req.body.prod_categoria,
    prod_descripcion: req.body.prod_descripcion,
    //prod_url: req.body.prod_url
  };
  // Guardar Rol en la base de datos
  Producto.create(producto)
  .then(Producto => {
    res.status(200).send(Producto);
  })
  .catch(err => {
    // res.status(500).send({
    //   mensaje:
    //     err.message || "Ocurrio un error al crear Rol."
    // });
    //res.status(500).sendFile(path.join(__dirname, '../source/img', 'error.png'));
    res.status(500).send({mensaje: "Error al crear producto"});
  });
};


// Recuperar todos los Productos de la base de datos
exports.findAll = (req, res) => {
  Producto.findAll()
    .then(Producto => {
      res.status(200).send(Producto);
    })
    .catch(err => {
      res.status(500).send({
        mensaje:
          err.message || "Ocurrio un error al recuperar todos los Producto."
      });
    });
};

//Buscar Producto por Nombre
exports.findOne = (req, res) => {
  const nombre = req.params.prod_nombre;
  Producto.findOne({where:{prod_nombre: nombre}})
    .then(Producto => {
      res.status(200).send(Producto);
    })
    .catch(err => {
      res.status(500).send({
        mensaje: "Error al recuperar Productos por id=" + id
      });
    });
};

//Actualzar Producto por Id
exports.update = (req, res) => {
  const id = req.params.id;
  //checar si cambia la contraseña, para pasarla a hash

  var datos = req.body;
  if (req.body.prod_precio != undefined) {
    datos.prod_precio = req.body.prod_precio;
  }

  Producto.update(datos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          mensaje: "Producto se actualizo con exito."
        });
      } else {
        // res.send({
        //   mensaje: `Error al actualizar Productos con id=${id}!`
        // });
        res.status(500).sendFile(path.join(__dirname, '../source/img', 'error.png'));
      }
    })
    .catch(err => {
      // res.status(500).send({
      //   mensaje: "Error al actualizar Productos con id=" + id
      // });
      res.status(500).sendFile(path.join(__dirname, '../source/img', 'error.png'));
    });
};

// Eliminar un Producto por id
exports.delete = (req, res) => {
  const id = req.params.id;

  Producto.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          mensaje: " Producto eliminado con exito!"
        });
      } else {
        // res.send({
        //   mensaje: `Error al eliminar Productos con id=${id}!`
        // });
        res.status(500).sendFile(path.join(__dirname, '../source/img', 'error.png'));
      }
    })
    .catch(err => {
      // res.status(500).send({
      //   mensaje: "Error al eliminar Productos con id=" + id
      // });
      res.status(500).sendFile(path.join(__dirname, '../source/img', 'error.png'));
    });
};

// Eliminar todos los Productos de la base de datos
exports.deleteAll = (req, res) => {
  Producto.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.status(200).send({ mensaje: `${nums} Productos fueron eliminados con exito!` });
    })
    .catch(err => {
      // res.status(500).send({
      //   mensaje:
      //     err.message || "Error al eliminar Productos."
      // });
      res.status(500).sendFile(path.join(__dirname, '../source/img', 'error.png'));
    });
};
