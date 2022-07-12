const Bank = require('./model');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };

            const bank = await Bank.find();
            
            return res.render('admin/bank/view_bank', { 
                bank, 
                alert,
                name: req.session.user.name,
                title: 'Halaman Bank' 
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/bank');
        }
    },
    viewCreate: async (req, res) => {
        try {
            return res.render('admin/bank/create', {
                name: req.session.user.name,
                title: 'Halaman Tambah Bank'
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/bank');
        }
    },
    actionCreate: async (req, res) => {
        try {
            const { name, nameBank, noRekening } = req.body;

            let bank = await Bank({ name, nameBank, noRekening });
            await bank.save();

            req.flash('alertMessage', 'Berhasil menambah bank');
            req.flash('alertStatus', 'success');

            return res.redirect('/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/bank');
        }
    },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;

            const bank = await Bank.findOne({_id: id});

            return res.render('admin/bank/edit', { 
                bank,
                name: req.session.user.name,
                title: 'Halaman Edit Bank'
            });

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/bank');
        }
    },
    actionEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, nameBank, noRekening } = req.body;

            await Bank.findOneAndUpdate({ _id: id }, { name, nameBank, noRekening });

            req.flash('alertMessage', 'Berhasil mengubah bank');
            req.flash('alertStatus', 'success');

            return res.redirect('/bank');

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/bank');
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;

            await Bank.findOneAndDelete({ _id: id });

            req.flash('alertMessage', 'Berhasil menghapus bank');
            req.flash('alertStatus', 'success');

            return res.redirect('/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/bank');
        }
    }
};