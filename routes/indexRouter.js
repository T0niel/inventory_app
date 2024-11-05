const { Router } = require('express');
const { renderIndex } = require('../controllers/indexController');
const router = Router();

router.get('/', renderIndex);

module.exports = router;
