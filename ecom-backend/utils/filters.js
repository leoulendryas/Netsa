const { models } = require('../config/db');
const Product = models.Product;
const ProductImage = models.ProductImage;
const { Op } = require('sequelize');

exports.filterProducts = async (filters) => {
    const whereClause = {};

    // Filter by Category
    if (filters.categoryId) whereClause.category_id = filters.categoryId;

    // Filter by Size
    if (filters.size) {
        whereClause['$Sizes.size$'] = { [Op.iLike]: filters.size };
    }

    // Filter by Fit
    if (filters.fit) {
        whereClause['$Fits.fit$'] = { [Op.iLike]: filters.fit };
    }

    // Filter by Color
    if (filters.color) whereClause.color = { [Op.iLike]: filters.color };

    // Filter by Gender
    if (filters.gender) whereClause.gender = { [Op.iLike]: filters.gender };

    // Filter by Price Range
    if (filters.priceMin && filters.priceMax) {
        whereClause.price = { [Op.between]: [Number(filters.priceMin), Number(filters.priceMax)] };
    } else if (filters.priceMin) {
        whereClause.price = { [Op.gte]: Number(filters.priceMin) };
    } else if (filters.priceMax) {
        whereClause.price = { [Op.lte]: Number(filters.priceMax) };
    }

    // Filter by New or Featured Products
    if (filters.isNew === 'true') whereClause.is_new = true;
    if (filters.isFeatured === 'true') whereClause.is_featured = true;

    // Implement Sorting
    const order = [];
    if (filters.sortBy && filters.order) {
        order.push([filters.sortBy, filters.order]); // Example: sortBy 'price', order 'ASC' or 'DESC'
    }

    // Pagination (default values if not provided)
    const limit = filters.limit ? parseInt(filters.limit, 10) : 10;
    const offset = filters.page ? (parseInt(filters.page, 10) - 1) * limit : 0;

    return await Product.findAndCountAll({
        where: whereClause,
        include: [
            { model: ProductImage },
            { model: models.Size, through: { attributes: [] } },
            { model: models.Fit, through: { attributes: [] } },
            { model: models.Category }
        ],
        order,
        limit,
        offset
    });
};
