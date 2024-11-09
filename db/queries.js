const pool = require('./pool');

async function getCategories() {
  const query = 'SELECT * FROM car_part_categories';
  const { rows } = await pool.query(query);
  return rows.map(({ category_name }) => category_name);
}

async function getItemsByCategory(category) {
  const query = `SELECT c.id, c.part_name, c.description, i.directory FROM car_part_category_pivot p 
                    INNER JOIN
                    car_parts c 
                    ON c.id = p.car_part_id 
                    INNER JOIN car_part_categories cc 
                    ON cc.id = p.car_part_category_id
                    INNER JOIN images i
                    ON c.image_id = i.id
                    WHERE cc.category_name LIKE $1;`;

  const { rows } = await pool.query(query, [category]);
  return rows;
}

async function getItemById(id) {
  const query = `SELECT c.id, c.part_name, c.description, i.directory FROM car_part_category_pivot p 
                    INNER JOIN
                    car_parts c 
                    ON c.id = p.car_part_id 
                    INNER JOIN car_part_categories cc 
                    ON cc.id = p.car_part_category_id
                    INNER JOIN images i
                    ON c.image_id = i.id
                    WHERE c.id = $1;`;
  
  const {rows} = await pool.query(query, [id]);
  return rows[0]; 
}

async function deleteImageById(id){
  const query = `DELETE FROM images WHERE id = $1`;

  await pool.query(query, [id]);
  return true;
}

async function getCategoriesByName(categoryName) {
  const query = 'SELECT * FROM car_part_categories WHERE category_name = $1';
  const { rows } = await pool.query(query, [categoryName]);
  return rows;
}

async function getCarPartProducerByName(companyName) {
  const query = `SELECT * FROM car_part_producers WHERE company_name = $1`;

  const { rows } = await pool.query(query, [companyName]);
  return rows;
}

async function insertCarPartProducer(companyName) {
  const query = `INSERT INTO 
	                car_part_producers (
                        company_name
                    )
                    VALUES
	                    ($1)
                    RETURNING id;`;

  const { rows } = await pool.query(query, [companyName]);
  return rows[0].id;
}

async function insertImage(directory, creationDate) {
  const query = `INSERT INTO 
	                images (
                        directory,
                        creation_date
                    )
                    VALUES
	                    ($1, $2)
                    RETURNING id;`;

  const { rows } = await pool.query(query, [directory, creationDate]);
  return rows[0].id;
}

async function insertCarPart(
  partName,
  productionDate,
  price,
  producer,
  imageDir,
  imageCreationDate,
  description = null
) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let carPartProducerId = (await getCarPartProducerByName(producer))[0]?.id;
    if (!carPartProducerId) {
      carPartProducerId = await insertCarPartProducer(producer, client);
    }
    const imageId = await insertImage(imageDir, imageCreationDate, client);

    const query = `INSERT INTO 
                        car_parts (
                            part_name,
                            production_date,
                            description,
                            price,
                            car_part_producer_id,
                            image_id
                        )
                    VALUES
                        (
                            $1, 
                            $2, 
                            $3, 
                            $4, 
                            $5, 
                            $6
                    ) RETURNING id;`;

    const { rows } = await client.query(query, [
      partName,
      productionDate,
      description,
      price,
      carPartProducerId,
      imageId,
    ]);

    await client.query('COMMIT');
    return rows[0].id;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function insertCarPartCategory(categoryName) {
  const query = `INSERT INTO
                        car_part_categories (category_name)
                    VALUES
                        ($1)
                    RETURNING id;`;

  const { rows } = await pool.query(query, [categoryName]);
  return rows[0].id;
}

async function insertCarPartCategoryPivot(carPartCategoryId, carPartId) {
  const query = `INSERT INTO
                        car_part_category_pivot (car_part_category_id, car_part_id)
                   VALUES
                        ($1, $2)
                    RETURNING car_part_category_id, car_part_id;`;

  const { rows } = await pool.query(query, [carPartCategoryId, carPartId]);
  return rows[0];
}

async function insertItem(
  partName,
  productionDate,
  price,
  producer,
  imageDir,
  imageCreationDate,
  categoryName,
  description = null
) {
  const matchingCategories = await getCategoriesByName(categoryName);
  const category = matchingCategories[0];

  if (!matchingCategories) {
    throw new Error('Provide a valid category');
  }

  const carPartId = await insertCarPart(
    partName,
    productionDate,
    price,
    producer,
    imageDir,
    imageCreationDate,
    description
  );
  await insertCarPartCategoryPivot(category.id, carPartId);

  return carPartId;
}

async function deleteCarPart(id) {
  const query = `
    DELETE FROM car_parts WHERE id = $1
  `;

  const { rows } = await pool.query(query, [id]);
  return rows;
}

module.exports = {
  getCategories,
  getItemsByCategory,
  insertItem,
  deleteCarPart,
  getItemById,
  deleteImageById
};
