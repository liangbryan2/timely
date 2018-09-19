module.exports = function (sequelize, DataTypes){
    var UsersBooks = sequelize.define("UsersBooks", {
        complete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        inProgress: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return UsersBooks;
}