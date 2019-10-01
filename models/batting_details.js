module.exports = (sequelize, DataTypes) => {
    const batting_detail = sequelize.define('batting_detail', {
        player_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            references: {model: 'player_details', key: 'player_id'}
        },
        innings: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        batting_average: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        strike_rate: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        runs: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        balls_faced: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        highest: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        hundreds: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sixes: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fours: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    batting_detail.associate = models => {
        // associations can be defined here
    };

    return batting_detail;
};
