const pool = require('./pool');

async function getCategories(){
    const query = 'SELECT * FROM car_part_categories';
    const {rows} = await pool.query(query);
    return rows.map(({category_name}) => category_name);
}

async function getItems(category){
    const query = `SELECT c.part_name, c.description, i.directory FROM car_part_category_pivot p 
                    INNER JOIN
                    car_parts c 
                    ON c.id = p.car_part_id 
                    INNER JOIN car_part_categories cc 
                    ON cc.id = p.car_part_category_id
                    INNER JOIN images i
                    ON c.image_id = i.id
                    WHERE cc.category_name = $1;`;

    const {rows} = await pool.query(query, [category]);
    return rows;
}

module.exports = {
    getCategories,
    getItems
}