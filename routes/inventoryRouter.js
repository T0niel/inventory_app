const { Router } = require('express');
const { getCreateForm } = require('../controllers/inventoryController');
const router = Router();

router.get('/createItem', getCreateForm);

module.exports = router;
