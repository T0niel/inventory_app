const { getCategories, getItemsByCategory } = require('../db/queries');
const HttpError = require('../errors/httpError');
const path = require('path');

async function renderIndex(req, res, next) {
  let { category } = req.query;
  try {
    const categories = await getCategories();

    if (categories.length === 0) {
      return res.render('index');
    }

    if (!category) {
      category = categories[0];
    }

    const itemsData = await getItemsByCategory(category);
    const items = itemsData.map((item) => ({
      ...item,
      directory: path.join('images', item.directory),
    }));
    res.render('index', { categories, selected: category, items });
  } catch (e) {
    next(new HttpError('Internal server error', 500));
  }
}

module.exports = { renderIndex };
