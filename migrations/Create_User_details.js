module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('user_details', {
            user_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING
            },
            team_name: {
                unique: true,
                type: Sequelize.STRING
            },
            balance: {
                type: Sequelize.INTEGER
            },
            user_token: {
                unique: true,
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

    down: (queryInterface /* , Sequelize */) => queryInterface.dropTable('user_details')
};
