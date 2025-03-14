const { sequelize, models } = require('../config/db');  // Import sequelize
const Order = models.Order;
const OrderItem = models.OrderItem;
const CartItem = models.CartItem;

// Create an order
exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // Create the order
    const order = await Order.create(req.body, { transaction: t });

    // Map order items, including size
    const orderItems = req.body.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      size: item.size, // Include size
    }));

    // Bulk create the order items
    await OrderItem.bulkCreate(orderItems, { transaction: t });

    // Empty the cart by removing all cart items for the given cart_id
    await CartItem.destroy({ where: { cart_id: req.body.cart_id }, transaction: t });

    // Commit the transaction
    await t.commit();

    res.status(201).json(order);
  } catch (error) {
    // Rollback transaction in case of an error
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [models.OrderItem],
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [models.OrderItem],
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    await order.update(req.body);
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    await order.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
