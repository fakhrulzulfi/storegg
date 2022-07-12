const Transaction = require('./model');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };

            const transaction = await Transaction.find();

            return res.render('admin/transaction/view_payment', { 
                transaction, 
                alert,
                name: req.session.user.name,
                title: 'Halaman Transaksi'
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/transaction');
        }
    },
    actionStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.query;

            await Transaction.findByIdAndUpdate({ _id: id }, { status });
            req.flash('alertMessage', 'Berhasil mengubah status transaksi');
            req.flash('alertStatus', 'success');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
        } finally {
            return res.redirect('/transaction');
        }
    }
}