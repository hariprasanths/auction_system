module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('bid_details', {
            bid_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            player_id: {
                references: {model: 'player_details', key: 'player_id'},
                type: Sequelize.INTEGER,
                allowNull: false
            },
            user_id: {
                references: {model: 'user_details', key: 'user_id'},
                type: Sequelize.INTEGER,
                allowNull: false
            },
            bid_price: {
                type: Sequelize.BIGINT,
                allowNull: false
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

    down: (queryInterface /* , Sequelize */) => queryInterface.dropTable('bid_details')
};
