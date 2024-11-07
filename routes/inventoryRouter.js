const { Router } = require('express');
const { getCreateForm, createItem } = require('../controllers/inventoryController');
const router = Router();

router.get('/createItem', getCreateForm);
router.post('/createItem', createItem);

module.exports = router;
