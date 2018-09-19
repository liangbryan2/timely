module.exports = function (sequelize, DataTypes){
    var UsersShows = sequelize.define("UsersShows", {
        complete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        inProgress: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return UsersShows;
}