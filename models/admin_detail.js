module.exports = (sequelize, DataTypes) => {
    const admin_detail = sequelize.define('admin_detail', {
        admin_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING,
            unique: true
        },
        token: {
            type: DataTypes.STRING,
            unique: true
        }
    });

    admin_detail.associate = models => {
        // associations can be defined here
    };

    return admin_detail;
};
