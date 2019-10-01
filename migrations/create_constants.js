module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('constants', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            balance: {
                type: Sequelize.BIGINT,
                allowNull: false
            },
            min_players: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            min_bowlers: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            min_allrounders: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            min_wicketkeepers: {
                type: Sequelize.INTEGER,
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

    down: (queryInterface /* , Sequelize */) => queryInterface.dropTable('constants')
};
