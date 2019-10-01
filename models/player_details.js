module.exports = (sequelize, DataTypes) => {
    const player_detail = sequelize.define('player_detail', {
        player_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        player_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        player_country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        player_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        player_age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        player_aggression: {
            type: DataTypes.INTEGER
        },
        player_price: {
            type: DataTypes.BIGINT
        },
        skill_level_batting: {
            type: DataTypes.FLOAT
        },
        skill_level_bowling: {
            type: DataTypes.FLOAT
        },
        skill_level_fielding: {
            type: DataTypes.FLOAT
        },
        image_url: {
            type: DataTypes.STRING
        }
    });

    player_detail.associate = models => {
        // associations can be defined here
    };

    return player_detail;
};
