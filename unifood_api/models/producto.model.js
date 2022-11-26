module.exports = (sequelize, Sequelize) => {
    const Producto = sequelize.define("producto", {
        prod_nombre: {
            type: Sequelize.STRING
        },
        prod_precio: {
            type: Sequelize.FLOAT
        },
        prod_categoria: {
            type: Sequelize.STRING
        },
        prod_descripcion: {
            type: Sequelize.STRING
        },
        /*
        prod_url: {
            type: Sequelize.STRING
        }
        */
    });

    return Producto;
};