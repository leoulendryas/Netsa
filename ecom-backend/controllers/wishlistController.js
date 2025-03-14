const { models } = require('../config/db');
const Wishlist = models.Wishlist;

// Add item to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const wishlistItem = await Wishlist.create({
      user_id: req.user.id,
      product_id: req.body.product_id,
    });
    res.status(201).json(wishlistItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get wishlist by user ID
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: models.Product,
          include: [
            models.ProductImage,
            { model: models.Size, through: { attributes: [] } }, // Include sizes
            { model: models.Fit, through: { attributes: [] } }   // Include fits
          ],
        },
      ],
    });

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!wishlistItem) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }
    await wishlistItem.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
