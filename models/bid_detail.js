module.exports = (sequelize, DataTypes) => {
    const bid_detail = sequelize.define('bid_detail', {
        bid_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        player_id: {
            references: {model: 'player_detail', key: 'player_id'},
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            references: {model: 'user_detail', key: 'user_id'},
            type: DataTypes.INTEGER,
            allowNull: false
        },
        bid_price: {
            type: DataTypes.BIGINT,
            allowNull: false
        }
    });

    bid_detail.associate = models => {
        // associations can be defined here
    };

    return bid_detail;
};
