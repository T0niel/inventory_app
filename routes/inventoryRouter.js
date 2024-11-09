const { Router } = require('express');
const { getCreateForm, createItem, deleteItem, getDeleteForm } = require('../controllers/inventoryController');
const router = Router();

router.get('/createItem', getCreateForm);
router.post('/createItem', createItem);
router.get('/delete/:id', getDeleteForm);
router.post('/delete/:id', deleteItem);

module.exports = router;
