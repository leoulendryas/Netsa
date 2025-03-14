const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    define: {
      freezeTableName: true, // This ensures Sequelize does not pluralize table names
      timestamps: true, // Keep timestamps if you want to use `createdAt` and `updatedAt`
    },
    sync: { sync: false, alter: true }, // Disable automatic syncing to avoid table duplication
  }
);

const models = {
  Cart: require('../models/cart')(sequelize, Sequelize.DataTypes),
  CartItem: require('../models/cartItem')(sequelize, Sequelize.DataTypes),
  Category: require('../models/category')(sequelize, Sequelize.DataTypes),
  CustomerDetail: require('../models/customerDetail')(sequelize, Sequelize.DataTypes),
  Order: require('../models/order')(sequelize, Sequelize.DataTypes),
  OrderItem: require('../models/orderItem')(sequelize, Sequelize.DataTypes),
  Product: require('../models/product')(sequelize, Sequelize.DataTypes),
  ProductImage: require('../models/productImage')(sequelize, Sequelize.DataTypes),
  SaleProduct: require('../models/saleProduct')(sequelize, Sequelize.DataTypes),
  Size: require('../models/size')(sequelize, Sequelize.DataTypes),   // Add Size model here
  Fit: require('../models/fit')(sequelize, Sequelize.DataTypes),     // Add Fit model here
  User: require('../models/user')(sequelize, Sequelize.DataTypes),
  Wishlist: require('../models/wishlist')(sequelize, Sequelize.DataTypes),
};

// Apply associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = { sequelize, models };
