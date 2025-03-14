module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_method: { type: DataTypes.STRING(50), defaultValue: 'hand-to-hand' },
    order_status: { type: DataTypes.STRING(20), defaultValue: 'pending' },
  }, { tableName: 'orders', timestamps: true });

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'SET NULL', constraintName: 'custom_fk_name' });
    Order.hasMany(models.OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
  };

  return Order;
};
