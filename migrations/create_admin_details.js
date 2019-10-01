module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('admin_details', {
            admin_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING
            },
            name: {
                unique: true,
                type: Sequelize.STRING
            },
            token: {
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
