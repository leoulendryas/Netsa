const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432, // Add port from env if defined
    dialect: 'postgres',
    logging: false,
    define: {
      freezeTableName: true, // Prevent pluralization
      timestamps: true,      // Keep createdAt/updatedAt
    },
    sync: { sync: false, alter: false}, // Disable automatic syncing
  }
);

// Test the DB connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to DB:', process.env.DB_NAME, '@', process.env.DB_HOST, ':', process.env.DB_PORT);
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

// Load models
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
  Size: require('../models/size')(sequelize, Sequelize.DataTypes),
  Fit: require('../models/fit')(sequelize, Sequelize.DataTypes),
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
