const {Client} = require('pg');
const connectionString = process.argv[2];

const client = new Client({
    connectionString
})

const SQL = `
    CREATE TABLE IF NOT EXISTS car_part_categories (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        category_name VARCHAR(255) NOT NULL
    );


    CREATE TABLE IF NOT EXISTS car_parts (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        part_name VARCHAR(255) NOT NULL,    
        production_date DATE NOT NULL,
        description TEXT NULL,
        price INTEGER NOT NULL,
        car_part_producer_id BIGINT NOT NULL,
        image_id BIGINT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS car_part_category_pivot (
        car_part_category_id BIGINT NOT NULL,
        car_part_id BIGINT NOT NULL,
  
        FOREIGN KEY (car_part_category_id) REFERENCES car_part_categories(id),
        FOREIGN KEY (car_part_id) REFERENCES car_parts(id),
  
        PRIMARY KEY (car_part_category_id, car_part_id)
    );

    CREATE TABLE IF NOT EXISTS cars (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS car_part_cars_pivot (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        car_part_id BIGINT NOT NULL,
        car_id BIGINT NOT NULL,
  
        FOREIGN KEY (car_part_id) REFERENCES car_parts(id),
        FOREIGN KEY (car_id) REFERENCES cars(id)
    );

    CREATE TABLE IF NOT EXISTS car_part_producers (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        company_name VARCHAR(50) UNIQUE
    );

    CREATE TABLE IF NOT EXISTS images (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        directory VARCHAR(255) NOT NULL,
        creation_date DATE NOT NULL
    );

    -- Dummy data
    INSERT INTO
        car_part_producers (
            company_name
        )
    VALUES
        ('BNW');

    INSERT INTO 
	    images (
            directory,
            creation_date
        )
    VALUES (
        'engine-images/BMW-B38.png',
        '2024-11-6'
    );
  
    INSERT INTO
        car_parts (
        part_name,
        production_date,
        description,
        price,
        car_part_producer_id,
        image_id
    )
    VALUES
        ('BMW B38', '2013-01-01', 'BMW engine', 200, 1, 1);

    INSERT INTO
        car_part_categories(
            category_name
        )
    VALUES
        ('Engines'),
        ('Transmissions'),
        ('Brakes'),
        ('Suspension'),
        ('Exhaust'),
        ('Electrical'),
        ('Fuel System'),
        ('Cooling System'),
        ('Interior'),
        ('Exterior');
    
    INSERT INTO 
		car_part_category_pivot(
            car_part_category_id,
            car_part_id
        )
    VALUES
 		(1, 1);
`;

async function init(){
    console.log('seeding...');
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log('populated database.');
}

init();

// node db/populatedb.js postgres://user:pass@localhost:5432/dbName