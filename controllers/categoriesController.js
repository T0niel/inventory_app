const {
  getCategories,
  deleteCategoryByName,
  insertCarPartCategory,
} = require('../db/queries');
const { body, validationResult } = require('express-validator');
const isAdmin = require('../middlewares/isAdmin');
const HttpError = require('../errors/httpError');

async function getManageCategories(req, res) {
  const categories = await getCategories();
  res.render('manageCategories', { categories });
}

// Create logic
async function createCategory(req, res, next) {
  try {
    const category = req.body.name;
    await insertCarPartCategory(category);
    res.redirect('/');
  } catch (e) {
    next(new HttpError('Internal server error', 500));
  }
}

async function validateCreateCategory(req, res, next) {
  const category = req.query.category;
  const categories = await getCategories();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('manageCategories', {
      category,
      categories,
      errors: errors.array(),
    });
  }

  next();
}

const createCategorySchemaInput = [
  body('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isAlpha()
    .withMessage('Category name must only contain characters'),
  body('password')
    .notEmpty()
    .withMessage('The admin authentication is required')
    .matches(process.env.ADMIN_PASSWORD)
    .withMessage('Invalid password')
    .escape(),
];

// Delete logic
async function getDeleteCategory(req, res) {
  const category = req.query.category;
  res.render('deleteCategory', { category });
}

async function deleteCategory(req, res, next) {
  try {
    const category = req.body.category;
    await deleteCategoryByName(category);
    res.redirect('/');
  } catch (e) {
    next(new HttpError('Internal server error', 500));
  }
}

async function validateDeleteCategory(req, res, next) {
  const category = req.body.category;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('deleteCategory', {
      category,
      errors: errors.array(),
    });
  }

  next();
}

const deleteCategorySchemaInput = [
  body('password')
    .notEmpty()
    .withMessage('The admin authentication is required')
    .matches(process.env.ADMIN_PASSWORD)
    .withMessage('Invalid password')
    .escape(),
];

module.exports = {
  getManageCategories,
  getDeleteCategory,
  deleteCategory: [
    deleteCategorySchemaInput,
    validateDeleteCategory,
    isAdmin,
    deleteCategory,
  ],
  createCategory: [
    createCategorySchemaInput,
    validateCreateCategory,
    isAdmin,
    createCategory,
  ],
};
