const router = require('express').Router();
const multer = require('multer');
const os = require('os');
const {
    signUp,
} = require('./controller');

router.post('/signup', multer({dest: os.tmpdir()}).single('image'), signUp);

module.exports = router;
