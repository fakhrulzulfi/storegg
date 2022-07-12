module.exports = {
    isLoginAdmin: async (req, res, next) => {
        if( req.session.user === null || req.session.user === undefined ) {
            req.flash('alertMessage', 'Sesi anda telah habis, silahkan login ulang');
            req.flash('alertStatus', 'danger');
            return res.redirect('/');
        }
        next();
    }
}