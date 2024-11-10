const { Router } = require('express');
const {
  getCreateForm,
  createItem,
  deleteItem,
  getDeleteForm,
  editItem,
  getEditItemForm,
} = require('../controllers/inventoryController');
const router = Router();

router.get('/createItem', getCreateForm);
router.post('/createItem', createItem);

router.get('/delete/:id', getDeleteForm);
router.post('/delete/:id', deleteItem);

router.get('/edit/:id', getEditItemForm);
router.post('/edit/:id', editItem)

module.exports = router;
