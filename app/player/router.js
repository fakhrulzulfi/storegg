const router = require('express').Router();
const {
    landingPage,
    detailPage,
    category,
    checkout,
    history,
    historyDetail,
} = require('./controller');

// middleware
const { isLogin } = require('../middleware/auth');

router.get('/landingpage', landingPage);
router.get('/:id/detail', detailPage);
router.get('/category', category);
router.post('/checkout', isLogin, checkout);
router.get('/history', isLogin, history);
router.get('/history/:id/detail', isLogin, historyDetail);

module.exports = router;
