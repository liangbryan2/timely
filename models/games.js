module.exports = function (sequelize, DataTypes) {
    var Games = sequelize.define("Games", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 255]
            }
        },
        mainLength: DataTypes.FLOAT,
        completionistLength: DataTypes.FLOAT,
        imgUrl: DataTypes.STRING,
        hltbID: DataTypes.INTEGER,
        mainMinutes: DataTypes.INTEGER,
        completeMinutes: DataTypes.INTEGER
    });

    Games.associate = function (models) {
        Games.belongsToMany(models.Users, {
            through: {
                model: models.UsersGames
            }
        });
        Games.hasMany(models.Reviews);
    };

    return Games;
};