const { sequelize, models } = require('../config/db');
const Cart = models.Cart;
const CartItem = models.CartItem;

// Create a cart for a user
exports.createCart = async (req, res) => {
  try {
    const cart = await Cart.create({ user_id: req.body.user_id });
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get cart by user ID
exports.getCartByUserId = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { user_id: req.params.user_id },
      include: [models.CartItem],
    });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add item to cart
exports.addItemToCart = async (req, res) => {
  const t = await sequelize.transaction(); // Begin transaction
  try {
    const { cart_id, product_id, quantity, price_at_time_of_addition, size } = req.body;

    // Validate required fields
    if (!size) {
      return res.status(400).json({ error: 'Size is required' });
    }

    // Create the cart item within a transaction
    const cartItem = await CartItem.create({
      cart_id,
      product_id,
      quantity,
      price_at_time_of_addition,
      size, // Include size
    }, { transaction: t });

    await t.commit(); // Commit the transaction
    res.status(201).json(cartItem);
  } catch (error) {
    await t.rollback(); // Rollback transaction in case of an error
    res.status(400).json({ error: error.message });
  }
};

// Update cart item (quantity and size)
exports.updateCartItem = async (req, res) => {
  const t = await sequelize.transaction(); // Begin transaction
  try {
    const cartItem = await CartItem.findByPk(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const { quantity, size } = req.body;

    // Validate required fields
    if (!size) {
      return res.status(400).json({ error: 'Size is required' });
    }

    // Update cart item within the transaction
    await cartItem.update({ quantity, size }, { transaction: t });
    
    await t.commit(); // Commit the transaction
    res.status(200).json(cartItem);
  } catch (error) {
    await t.rollback(); // Rollback transaction in case of an error
    res.status(400).json({ error: error.message });
  }
};

// Remove item from cart
exports.removeItemFromCart = async (req, res) => {
  const t = await sequelize.transaction(); // Begin transaction
  try {
    const cartItem = await CartItem.findByPk(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Remove cart item within the transaction
    await cartItem.destroy({ transaction: t });
    
    await t.commit(); // Commit the transaction
    res.status(204).end();
  } catch (error) {
    await t.rollback(); // Rollback transaction in case of an error
    res.status(400).json({ error: error.message });
  }
};
