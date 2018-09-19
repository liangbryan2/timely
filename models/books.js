module.exports = function (sequelize, DataTypes) {
    var Books = sequelize.define("Books", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 255]
            }
        },
        pages: DataTypes.FLOAT,
        imgUrl: DataTypes.STRING,
        gBooksID: DataTypes.STRING
    });

    Books.associate = function (models) {
        Books.belongsToMany(models.Users, {
            through: {
                model: models.UsersBooks
            }
        })
    };

    return Books;
};