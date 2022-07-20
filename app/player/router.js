const router = require('express').Router();
const {
    landingPage,
    detailPage,
    category,
    checkout,
} = require('./controller');

// middleware
const { isLogin } = require('../middleware/auth');

router.get('/landingpage', landingPage);
router.get('/:id/detail', detailPage);
router.get('/category', category);
router.post('/checkout', isLogin, checkout);

module.exports = router;
