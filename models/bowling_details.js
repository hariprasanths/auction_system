module.exports = (sequelize, DataTypes) => {
    const bowling_detail = sequelize.define('bowling_detail', {
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
        bowling_average: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        balls_bowled: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        economy: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        bowling_style: {
            type: DataTypes.STRING,
            allowNull: false
        },
        wickets_taken: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        best_bowling_figure: {
            type: DataTypes.STRING,
            allowNull: false
        },
        bowling_strike_rate: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        catches: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        stumpings: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    bowling_detail.associate = models => {
        // associations can be defined here
    };

    return bowling_detail;
};
