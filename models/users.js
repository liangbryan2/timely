module.exports = function(sequelize, DataTypes) {
    var Users = sequelize.define("Users", {
        userName: DataTypes.STRING,
        name: DataTypes.STRING,
        firebaseId: DataTypes.STRING,
        imgUrl: {
            type: DataTypes.STRING,
            defaultValue: "http://www.animalspot.net/wp-content/uploads/2017/08/Baby-Penguin.jpg"
        }
    });

    Users.associate = function(models) {

        Users.belongsToMany(models.Games, {
            through: {model: models.UsersGames}
        });
        Users.belongsToMany(models.Movies, {
            through: {model: models.UsersMovies}
        });
        Users.belongsToMany(models.Books, {
            through: {model: models.UsersBooks}
        });
        Users.belongsToMany(models.Shows, {
            through: {model: models.UsersShows}
        });
        Users.hasMany(models.Reviews);
        
    }
    return Users;
};