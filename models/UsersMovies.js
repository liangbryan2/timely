module.exports = function (sequelize, DataTypes){
    var UsersMovies = sequelize.define("UsersMovies", {
        complete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        inProgress: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return UsersMovies;
}