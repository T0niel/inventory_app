const {
  getCategories,
  insertItem,
  deleteCarPart,
  getItemById,
  deleteImageById,
} = require('../db/queries');
const { body, validationResult } = require('express-validator');
const HttpError = require('../errors/httpError');
const isAdmin = require('../middlewares/isAdmin');
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');


//Create item functionality
async function getCreateForm(req, res) {
  try {
    let { category } = req.query;
    const categories = await getCategories();

    if (categories.length === 0) {
      return res.render('index');
    }

    if (!category) {
      category = categories[0];
    }

    res.render('createItem', { categories, selected: category });
  } catch (e) {
    throw new HttpError('Internal server error', 500);
  }
}

async function validateItem(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //delete the image in case the form was invalid
    if (req.file?.filename) {
      await fs.rm(path.join(uploadDir, req.file.filename));
    }
    let { category } = req.query;
    const categories = await getCategories();

    if (categories.length === 0) {
      return res.render('index');
    }

    if (!category) {
      category = categories[0];
    }

    return res.render('createItem', {
      categories,
      selected: category,
      errors: errors.array(),
    });
  }

  next();
}

async function createItem(req, res) {
  try {
    const now = new Date();
    const data = req.body;
    const { name, date, price, company, category, description, imgDir } = {
      ...data,
      imgDir: path.join('uploads', req.file.filename),
    };
    await insertItem(
      name,
      date,
      price,
      company,
      imgDir,
      now,
      category,
      description
    );
    res.redirect('/');
  } catch (e) {
    throw new HttpError('Internal server error', 500);
  }
}

const uploadDir = path.join(__dirname, '..', 'public', 'images', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
});

const itemSchemaInput = [
  body('file').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('File is required');
    }

    const allowedTypes = ['jpeg', 'png', 'bmp', 'webp'];

    if (!allowedTypes.includes(req.file.originalname.split('.')[1])) {
      throw new Error(
        'Invalid file type. Only JPEG, PNG, BMP, and WEBP are allowed.'
      );
    }

    return true;
  }),
  body('name')
    .isLength({ min: 3 })
    .withMessage('the name must be at least be 3 characters'),
  body('date').isDate().withMessage('the date should be a valid date'),
  body('price')
    .isNumeric({ no_symbols: true })
    .withMessage('the price should be a number with no symbols'),
  body('company')
    .toLowerCase()
    .isIn([
      'bosch',
      'continental',
      'denso',
      'bmw',
      'mercedes-benz',
      'toyota',
      'ford',
      'general motors',
      'other',
    ])
    .withMessage('the company should be one of the supported companies'),
  body('password')
    .notEmpty()
    .withMessage('the admin authentication is required')
    .matches(process.env.ADMIN_PASSWORD)
    .withMessage('Invalid password')
    .escape(),
  body('category').notEmpty().withMessage('the category is required'),
  body('descrition').optional({ values: 'falsy' }),
];

//Delete item functionality
async function deleteItem(req, res) {
  try {
    const id = req.params.id;
    const item = await getItemById(id);
    await deleteCarPart(id);
    await deleteImageById(id);
    await fs.rm(path.join(uploadDir, path.basename(item.directory)), {
      force: true,
    });
    res.redirect('/');
  } catch (e) {
    throw new HttpError('Internal server error', 500);
  }
}

async function validateDeleteItem(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const id = req.params.id;

    return res.render('delete', {
      id,
      errors: errors.array(),
    });
  }

  next();
}

async function getDeleteForm(req, res) {
  const id = req.params.id;
  res.render('delete', { id });
}

const deleteItemSchemaInput = [
  body('password')
    .notEmpty()
    .withMessage('the admin authentication is required')
    .matches(process.env.ADMIN_PASSWORD)
    .withMessage('Invalid password')
    .escape(),
];

module.exports = {
  getCreateForm,
  createItem: [
    upload.single('file'),
    itemSchemaInput,
    validateItem,
    isAdmin,
    createItem,
  ],
  deleteItem: [deleteItemSchemaInput, validateDeleteItem, isAdmin, deleteItem],
  getDeleteForm,
};
