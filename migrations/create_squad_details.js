module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('squad_details', {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                references: {model: 'user_details', key: 'user_id'},
                type: Sequelize.INTEGER
            },
            player_id: {
                references: {model: 'player_details', key: 'player_id'},
                type: Sequelize.INTEGER
            },
            player_stamina: {
                type: Sequelize.FLOAT
            },
            player_confidence: {
                type: Sequelize.FLOAT
            },
            player_aggression: {
                type: Sequelize.FLOAT
            },
            player_form: {
                type: Sequelize.FLOAT
            },
            is_injured: {
                type: Sequelize.BOOLEAN
            },
            skill_level_bowling: {
                type: Sequelize.FLOAT
            },
            skill_level_batting: {
                type: Sequelize.FLOAT
            },
            skill_level_fielding: {
                type: Sequelize.FLOAT
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }),

    down: (queryInterface /* , Sequelize */) => queryInterface.dropTable('user_details')
};
