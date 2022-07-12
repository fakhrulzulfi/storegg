const Payment = require('./model');
const Bank = require('../bank/model');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };

            const payment = await Payment.find()
                .populate('banks');

            return res.render('admin/payment/view_payment', { 
                payment, 
                alert,
                name: req.session.user.name,
                title: 'Halaman Pembayaran'
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/payment');
        }
    },
    viewCreate: async (req, res) => {
        try {
            const bank = await Bank.find();
            
            return res.render('admin/payment/create', { 
                bank,
                name: req.session.user.name,
                title: 'Halaman Tambah Pembayaran'
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/payment');
        }
    },
    actionCreate: async (req, res) => {
        try {
            const { type, banks } = req.body;

            let payment = await Payment({ type, banks });
            await payment.save();

            req.flash('alertMessage', 'Berhasil menambah pembayaran');
            req.flash('alertStatus', 'success');

            return res.redirect('/payment');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/payment');
        }
    },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;

            const bank = await Bank.find();
            const payment = await Payment.findOne({_id: id})
                .populate('banks');

            return res.render('admin/payment/edit', { 
                payment, 
                bank,
                name: req.session.user.name,
                title: 'Halaman Edit Pembayaran'
            });

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/payment');
        }
    },
    actionEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const { type, banks } = req.body;

            await Payment.findOneAndUpdate({ _id: id }, { type, banks });

            req.flash('alertMessage', 'Berhasil mengubah payment');
            req.flash('alertStatus', 'success');

            return res.redirect('/payment');

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/payment');
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;

            await Payment.findOneAndDelete({ _id: id });

            req.flash('alertMessage', 'Berhasil menghapus payment');
            req.flash('alertStatus', 'success');

            return res.redirect('/payment');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/payment');
        }
    },
    actionStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const payment = await Payment.findOne({_id: id});

            let paymentStatus = payment.status === 'Y' ? 'N' : 'Y';

            await Payment.findOneAndUpdate({_id: id}, {
                status: paymentStatus
            });

            req.flash('alertMessage', 'Berhasil mengubah status payment');
            req.flash('alertStatus', 'success');

            return res.redirect('/payment');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/payment');
        }
    }
};