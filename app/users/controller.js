const User = require('./model');
const bcrypt = require('bcryptjs');

module.exports = {
    viewSignIn: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };

            // check session 
            if( req.session.user === null || req.session.user === undefined ) {
                return res.render('admin/users/view_signin', { alert });
            }
            
            return res.redirect('/dashboard');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/');
        }
    },
    actionSignIn: async (req, res) => {
        try {
            const { email, password } = req.body;
            const userCheck = await User.findOne({ email });

            if (userCheck) {
                if( userCheck.status === 'Y' ) {
                    const checkPassword = await bcrypt.compare(password, userCheck.password);

                    if( checkPassword ) {
                        req.session.user = {
                            id: userCheck._id,
                            email: userCheck.email,
                            status: userCheck.status,
                            name: userCheck.name
                        };

                        return res.redirect('/dashboard');
                    } else {
                        req.flash('alertMessage', 'Kata sandi salah');
                        req.flash('alertStatus', 'danger');
                        return res.redirect('/');    
                    }

                } else {
                    req.flash('alertMessage', 'Mohon maaf user anda belum aktif');
                    req.flash('alertStatus', 'danger');
                    return res.redirect('/');    
                }
            } else {
                req.flash('alertMessage', 'Email yang anda masukkan salah');
                req.flash('alertStatus', 'danger');
                return res.redirect('/');    
            }
            
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/');
        }
    },
    actionLogOut: (req, res) => {
        try {
            req.session.destroy();

            return res.redirect('/');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/');
        }
    }
};