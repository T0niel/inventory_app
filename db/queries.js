const pool = require('./pool');

async function getCategories(){
    const query = 'SELECT * FROM car_part_categories';
    const {rows} = await pool.query(query);
    return rows.map(({category_name}) => category_name);
}

module.exports = {
    getCategories
}