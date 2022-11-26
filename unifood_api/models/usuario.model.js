module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuario", {
        user_correo: {
            type: Sequelize.STRING
        },
        user_contrasenia: {
            type: Sequelize.STRING
        },
        user_nombre: {
            type: Sequelize.STRING
        },
        user_telefono: {
            type: Sequelize.STRING
        },
        estatus: {
            type: Sequelize.BOOLEAN
        },
        fechaRegistro:{
            type: Sequelize.DATEONLY
        },
        fechaVigencia:{
            type: Sequelize.DATEONLY
        },
        rolId:{
            type: Sequelize.INTEGER
        }
    });

    return Usuario;
};