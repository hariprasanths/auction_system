module.exports = (sequelize, DataTypes) => {
    const user_detail = sequelize.define('user_detail', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING
        },
        team_name: {
            type: DataTypes.STRING,
            unique: true
        },
        user_token: {
            type: DataTypes.STRING,
            unique: true
        },
        balance: {
            type: DataTypes.INTEGER
        }
    });

    user_detail.associate = models => {
        // associations can be defined here
    };

    return user_detail;
};
