module.exports = (sequelize, DataTypes) => {
    const simulation_detail = sequelize.define('squad_detail', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        user_id: {
            references: {model: 'user_details', key: 'user_id'},
            type: DataTypes.INTEGER
        },
        player_id: {
            references: {model: 'player_details', key: 'player_id'},
            type: DataTypes.INTEGER
        },
        player_stamina: {
            type: DataTypes.FLOAT
        },
        player_confidence: {
            type: DataTypes.FLOAT
        },
        player_aggression: {
            type: DataTypes.FLOAT
        },
        player_form: {
            type: DataTypes.FLOAT
        },
        is_injured: {
            type: DataTypes.BOOLEAN
        },
        skill_level_bowling: {
            type: DataTypes.FLOAT
        },
        skill_level_batting: {
            type: DataTypes.FLOAT
        },
        skill_level_fielding: {
            type: DataTypes.FLOAT
        }
    });

    simulation_detail.associate = models => {
        // associations can be defined here
    };

    return simulation_detail;
};
