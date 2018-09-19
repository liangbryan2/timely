module.exports = function (sequelize, DataTypes) {
    var Movies = sequelize.define("Movies", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 255]
            }
        },
        runtime: DataTypes.INTEGER,
        imgUrl: DataTypes.STRING,
        imdbID: DataTypes.STRING
    });

    Movies.associate = function (models) {
        Movies.belongsToMany(models.Users, {
            through: {
                model: models.UsersMovies
            }
        });
        Movies.hasMany(models.Reviews);
    };

    return Movies;
};