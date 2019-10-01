module.exports = (sequelize, DataTypes) => {
    const constant = sequelize.define('constant', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        balance: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        min_players: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        min_bowlers: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        min_allrounders: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        min_wicketkeepers: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    constant.associate = models => {
        // associations can be defined here
    };

    return constant;
};
