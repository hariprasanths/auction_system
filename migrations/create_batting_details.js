module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('batting_details', {
            player_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
                references: {model: 'player_details', key: 'player_id'}
            },
            innings: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            batting_average: {
                allowNull: false,
                type: Sequelize.FLOAT
            },
            strike_rate: {
                allowNull: false,
                type: Sequelize.FLOAT
            },
            runs: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            balls_faced: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            highest: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            hundreds: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            sixes: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            fours: {
                allowNull: false,
                type: Sequelize.INTEGER
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

    down: (queryInterface /* , Sequelize */) => queryInterface.dropTable('batting_details')
};
