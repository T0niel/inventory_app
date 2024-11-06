const { getCategories } = require('../db/queries');

async function renderIndex(req, res){
    const categories = await getCategories();
    res.render('index', {categories, selected: categories[0]});
}

module.exports = {renderIndex};