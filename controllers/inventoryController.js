const { getCategories } = require('../db/queries');
const { body, validationResult } = require('express-validator');
const HttpError = require('../errors/httpError');

const itemSchemaInput = [
  body('file')
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error('File is required');
      }

      const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/bmp',
        'image/webp',
      ];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        throw new Error(
          'Invalid file type. Only JPEG, PNG, BMP, and WEBP are allowed.'
        );
      }

      return true;
    })
    .withMessage('the image should be with the supported extensions.'),
  body('name')
    .isLength({ min: 3 })
    .withMessage('the name must be at least be 3 characters'),
  body('date').isDate().withMessage('the date should be a valid date'),
  body('price')
    .isNumeric({ no_symbols: true })
    .withMessage('the price should be a number with no symbols'),
  body('company')
    .isIn(['mercedes', 'bmw'])
    .withMessage('the company should be one of the supported companies'),
  body('password').notEmpty().escape().withMessage('the admin authenitcation is required'),
  body('category').notEmpty().withMessage('the category is required')
];

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

async function createItem(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
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

  res.redirect('index');
}

module.exports = {
  getCreateForm,
  createItem: [itemSchemaInput, createItem],
};
