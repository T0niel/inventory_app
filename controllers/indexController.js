const { getCategories, getItems } = require('../db/queries');
const HttpError = require('../errors/httpError');

async function renderIndex(req, res) {
  let { category } = req.query;
  try {
    const categories = await getCategories();

    if (categories.length === 0) {
      return res.render('index');
    }

    if (!category) {
      category = categories[0];
    }

    const itemsData = await getItems(category);
    const items = itemsData.map((item) => ({
      ...item,
      directory: `images/${item.directory}`,
    }));
    res.render('index', { categories, selected: category, items });
  } catch (e) {
    throw new HttpError('Internal server error', 500);
  }
}

module.exports = { renderIndex };
