module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('bowling_details', {
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
            bowling_average: {
                allowNull: false,
                type: Sequelize.FLOAT
            },
            balls_bowled: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            economy: {
                allowNull: false,
                type: Sequelize.FLOAT
            },
            bowling_style: {
                allowNull: false,
                type: Sequelize.STRING
            },
            wickets_taken: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            best_bowling_figure: {
                allowNull: false,
                type: Sequelize.STRING
            },
            bowling_strike_rate: {
                allowNull: false,
                type: Sequelize.FLOAT
            },
            catches: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            stumpings: {
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

    down: (queryInterface /* , Sequelize */) => queryInterface.dropTable('bowling_details')
};
