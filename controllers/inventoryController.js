const { getCategories } = require('../db/queries');

async function getCreateForm(req, res) {
  let { category } = req.query;
  const categories = await getCategories();

  if (categories.length === 0) {
    return res.render('index');
  }

  if (!category) {
    category = categories[0];
  }

  res.render('createItem', {categories, selected: category});
}

module.exports = {
  getCreateForm,
};
