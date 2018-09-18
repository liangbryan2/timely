module.exports = function(sequelize, DataTypes) {
    var Users = sequelize.define("Users", {
        userName: DataTypes.STRING,
        name: DataTypes.STRING,
        firebaseId: DataTypes.INTEGER,
        imgUrl: {
            type: DataTypes.STRING,
            defaultValue: "http://www.animalspot.net/wp-content/uploads/2017/08/Baby-Penguin.jpg"
        }
    });

    Users.associate = function(models) {

        // Users.hasMany(models.Reviews, {
        //     // Unsure what cascade does right now
        //     onDelete: "cascade"
        // });

        Users.belongsToMany(models.Games, {
            through: {model: models.UsersGames}
        })
    }
    return Users;
};