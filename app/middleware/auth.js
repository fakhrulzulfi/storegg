const config = require('../../config');
const jwt = require('jsonwebtoken');
const Player = require('../player/model');

module.exports = {
    isLoginAdmin: async (req, res, next) => {
        if( req.session.user === null || req.session.user === undefined ) {
            req.flash('alertMessage', 'Sesi anda telah habis, silahkan login ulang');
            req.flash('alertStatus', 'danger');
            return res.redirect('/');
        }
        next();
    },
    isLogin: async (req, res, next) => {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '') || null;
            const data = jwt.verify(token, config.jwtKey);
            const player = await Player.findOne({ _id: data.player.id });

            if( !player ) throw new Error();

            req.player = player;
            req.token = token;
            next();
        } catch (error) {
            return res.status(401).json({
                message: 'Not Authorized to access this resource.'
            })
        }
    },
}