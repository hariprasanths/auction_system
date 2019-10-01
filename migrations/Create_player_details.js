module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('player_details', {
            player_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            player_name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            player_country: {
                allowNull: false,
                type: Sequelize.STRING
            },
            player_type: {
                allowNull: false,
                type: Sequelize.STRING
            },
            player_age: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            player_aggression: {
                type: Sequelize.INTEGER
            },
            player_price: {
                type: Sequelize.BIGINT
            },
            skill_level_batting: {
                type: Sequelize.FLOAT
            },
            skill_level_bowling: {
                type: Sequelize.FLOAT
            },
            skill_level_fielding: {
                type: Sequelize.FLOAT
            },
            image_url: {
                type: Sequelize.STRING
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

    down: (queryInterface /* , Sequelize */) => queryInterface.dropTable('player_details')
};
