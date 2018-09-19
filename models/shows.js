module.exports = function (sequelize, DataTypes) {
    var Shows = sequelize.define("Shows", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 255]
            }
        },
        episodes: DataTypes.INTEGER,
        runtime: DataTypes.INTEGER,
        imgUrl: DataTypes.STRING,
        tvMazeID: DataTypes.STRING,
        minutes: DataTypes.INTEGER
    });

    Shows.associate = function (models) {
        Shows.belongsToMany(models.Users, {
            through: {
                model: models.UsersShows
            }
        });
        Shows.hasMany(models.Reviews);
    };

    return Shows;
};