const Nominal = require('./model');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };

            const nominal = await Nominal.find();
            
            return res.render('admin/nominal/view_nominal', { 
                nominal, 
                alert,
                name: req.session.user.name,
                title: 'Halaman Nominal'
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/nominal');
        }
    },
    viewCreate: async (req, res) => {
        try {
            return res.render('admin/nominal/create', {
                name: req.session.user.name,
                title: 'Halaman Tambah Nominal'
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/nominal');
        }
    },
    actionCreate: async (req, res) => {
        try {
            const { coinQuantity, coinName, price } = req.body;

            let nominal = await Nominal({ coinQuantity, coinName, price });
            await nominal.save();

            req.flash('alertMessage', 'Berhasil menambah nominal');
            req.flash('alertStatus', 'success');

            return res.redirect('/nominal');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/nominal');
        }
    },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;

            const nominal = await Nominal.findOne({_id: id});

            return res.render('admin/nominal/edit', { 
                nominal,
                name: req.session.user.name,
                title: 'Halaman Edit Nominal'
            });

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/nominal');
        }
    },
    actionEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const { coinQuantity, coinName, price } = req.body;

            await Nominal.findOneAndUpdate({ _id: id }, { coinQuantity, coinName, price });

            req.flash('alertMessage', 'Berhasil mengubah nominal');
            req.flash('alertStatus', 'success');

            return res.redirect('/nominal');

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/nominal');
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;

            await Nominal.findOneAndDelete({ _id: id });

            req.flash('alertMessage', 'Berhasil menghapus nominal');
            req.flash('alertStatus', 'success');

            return res.redirect('/nominal');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/nominal');
        }
    }
};