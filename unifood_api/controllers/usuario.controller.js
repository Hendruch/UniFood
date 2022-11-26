const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const express = require("express");
const path = require('path');
const moment = require('moment');

const Usuario = db.usuario;
const app = express();
app.set("llave", config.llave);

// Crear y Guardar un nuevo Usuario
exports.create = (req, res) => {
  Usuario.findOne({ where: { user_correo: req.body.user_correo } })
    .then(usuario => {
      // Validar request
      if (usuario) {
        res.status(400).send({
          mensaje: "Correo existente"
        });
        return;
      } else {
        // Crear un Usuario
        const passwordHash = bcrypt.hashSync(req.body.user_contrasenia, 10);

        const usuario = {
          user_correo: req.body.user_correo,
          user_contrasenia: passwordHash,
          user_nombre: req.body.user_nombre,
          user_telefono: req.body.user_telefono,
          estatus: req.body.estatus,
          fechaRegistro: req.body.fechaRegistro,
          fechaVigencia: req.body.fechaVigencia,
          rolId: req.body.rolId
        };

        // Guardar Usuario en la base de datos
        Usuario.create(usuario)
          .then(usuario => {
            res.status(200).send(usuario);
          })
          .catch(err => {
            // res.status(500).send({
            //   mensaje:
            //     err.message || "Ocurrio un error al crear Rol."
            // });
            res.status(500).sendFile(path.join(__dirname, '../source/img', 'error.png'));
          });
      }
    })
    .catch(err => {
      // res.status(500).send({
      //   mensaje: "Error al recuperar Usuario por correo"
      // });
      res.status(500).sendFile(path.join(__dirname, '../source/img', 'error.png'));
    });
};

// Recuperar todos los Usuarios de la base de datos
exports.findAll = (req, res) => {
  Usuario.findAll({
    include: [
      {
        model: db.rol,
      }],
  })
    .then(usuario => {
      res.status(200).send(usuario);
    })
    .catch(err => {
      res.status(500).send({
        mensaje:
          err.message || "Ocurrio un error al recuperar todos los Usuario."
      });
    });
};

//Buscar Usuario por Id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Usuario.findByPk(id, {
    include: [
      {
        model: db.rol,
      },
    ],
  })
    .then(usuario => {
      res.status(200).send(usuario);
    })
    .catch(err => {
      res.status(500).send({
        mensaje: "Error al recuperar Usuarios por id=" + id
      });
    });
};

//Actualzar Usuario por Id
exports.update = (req, res) => {
  const id = req.params.id;
  //checar si cambia la contraseña, para pasarla a hash

  var datos = req.body;
  if (req.body.contrasenia != undefined) {
    const passwordHash = bcrypt.hashSync(req.body.contrasenia, 10);
    datos.contrasenia = passwordHash;
  }

  Usuario.update(datos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          mensaje: "Usuarios se actualizo con exito."
        });
      } else {
        // res.send({
        //   mensaje: `Error al actualizar Usuarios con id=${id}!`
        // });
        res.status(500).sendFile(path.join(__dirname, '../source/img', 'error.png'));
      }
    })
    .catch(err => {
      // res.status(500).send({
      //   mensaje: "Error al actualizar Usuarios con id=" + id
      // });
      res.status(500).sendFile(path.join(__dirname, '../source/img', 'error.png'));
    });
};

// Eliminar un Usuario por id
exports.delete = (req, res) => {
  const id = req.params.id;

  Usuario.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          mensaje: " Usuario eliminado con exito!"
        });
      } else {
        // res.send({
        //   mensaje: `Error al eliminar Usuarios con id=${id}!`
        // });
        res.status(500).sendFile(path.join(__dirname, '../source/img', 'error.png'));
      }
    })
    .catch(err => {
      // res.status(500).send({
      //   mensaje: "Error al eliminar Usuarios con id=" + id
      // });
      res.status(500).sendFile(path.join(__dirname, '../source/img', 'error.png'));
    });
};

// Eliminar todos los Usuarios de la base de datos
exports.deleteAll = (req, res) => {
  Usuario.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.status(200).send({ mensaje: `${nums} Usuarios fueron eliminados con exito!` });
    })
    .catch(err => {
      // res.status(500).send({
      //   mensaje:
      //     err.message || "Error al eliminar Usuarios."
      // });
      res.status(500).sendFile(path.join(__dirname, '../source/img', 'error.png'));
    });
};


//Login por correo electronico
exports.login = (req, res) => {
  const correo = req.body.user_correo;
  const pwd = req.body.user_contrasenia;
  console.log("correo: " + correo);
  Usuario.findOne({ where: { user_correo: correo, estatus: true } })
    .then(usuario => {
      if (usuario) {
        const verified = bcrypt.compareSync(pwd, usuario.user_contrasenia);
        //mandar token
        if (verified) {
          const payload = {
            check: true,
          };
          const token = jwt.sign(payload, app.get("llave"), {
            expiresIn: '0.5 hrs',
          });
          const x2 = jwt.verify(token, app.get("llave"));
          var tokenData = moment(x2.exp * 1000).local().format("DD-MM-YYYY HH:mm");
          var cadena = tokenData.split(" ");
          var salida = {
            tokenData: {
              token: token,
              fecha: cadena[0],
              horaVencimiento: cadena[1]
            },
            usuario: usuario
          }
          
          if(usuario.rolId==1){
            return res.status(200).send(salida);
          }else if(usuario.rolId==2){
            return res.status(201).send(salida);
          }
          

          //res.status(200).send(usuario);

        } else {
          return res.status(404).send({
            mensaje: "Error de validación1",
          });
        }
      } else {
        return res.status(404).send({
          mensaje: "Error de validación",
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        mensaje:
          err.message || "Ocurrio un error al logearse"
      });
    });
};
