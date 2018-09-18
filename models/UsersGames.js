module.exports = function (sequelize, DataTypes){
    var UsersGames = sequelize.define("UsersGames", {
        complete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        inProgress: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return UsersGames;
}