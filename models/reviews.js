module.exports = function(sequelize, DataTypes) {
    var Reviews = sequelize.define("Reviews", {
        text: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {len: [3, 255]}
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1, max:5 }
        }
    });

    // Reviews.associate = function(models) {
    //     Reviews.belongsTo(models.Users, {
    //         foreignKey: {allowNull: false}
    //     });
    //     Reviews.belongsTo(models.Games, {
    //         foreignKey: {allowNull: false}
    //     });
    // };

    return Reviews;
};