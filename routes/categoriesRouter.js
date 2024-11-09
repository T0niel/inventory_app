const { Router } = require('express');
const {
  getManageCategories,
  getDeleteCategory,
  deleteCategory,
  createCategory,
} = require('../controllers/categoriesController');
const router = Router();

router.get('/manage', getManageCategories);
router.get('/delete', getDeleteCategory);
router.post('/delete', deleteCategory);
router.post('/create', createCategory);

module.exports = router;
