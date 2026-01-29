const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL is not defined in environment variables');
}

// Create Sequelize instance using Neon connection string
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // required for Neon
    },
  },
  define: {
    freezeTableName: true, // prevent pluralization
    timestamps: true,      // createdAt / updatedAt
  },
});

// Test DB connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to Neon PostgreSQL');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
  });

// Load models
const models = {
  Cart: require('../models/cart')(sequelize, DataTypes),
  CartItem: require('../models/cartItem')(sequelize, DataTypes),
  Category: require('../models/category')(sequelize, DataTypes),
  CustomerDetail: require('../models/customerDetail')(sequelize, DataTypes),
  Order: require('../models/order')(sequelize, DataTypes),
  OrderItem: require('../models/orderItem')(sequelize, DataTypes),
  Product: require('../models/product')(sequelize, DataTypes),
  ProductImage: require('../models/productImage')(sequelize, DataTypes),
  SaleProduct: require('../models/saleProduct')(sequelize, DataTypes),
  Size: require('../models/size')(sequelize, DataTypes),
  Fit: require('../models/fit')(sequelize, DataTypes),
  User: require('../models/user')(sequelize, DataTypes),
  Wishlist: require('../models/wishlist')(sequelize, DataTypes),
};

// Apply associations
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  models,
};
