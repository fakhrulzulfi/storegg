const Category = require('./model');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };

            const category = await Category.find();
            return res.render('admin/category/view_category', { 
                category, 
                alert,
                name: req.session.user.name,
                title: 'Halaman Kategori'
             });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/category');
        }
    },
    viewCreate: async (req, res) => {
        try {
            return res.render('admin/category/create', {
                name: req.session.user.name,
                title: 'Halaman Tambah Kategori'
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/category');
        }
    },
    actionCreate: async (req, res) => {
        try {
            const { name } = req.body;

            let category = await Category({ name });
            await category.save();

            req.flash('alertMessage', 'Berhasil menambah kategori');
            req.flash('alertStatus', 'success');

            return res.redirect('/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/category');
        }
    },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;

            const category = await Category.findOne({_id: id});

            return res.render('admin/category/edit', { 
                category,
                name: req.session.user.name,
                title: 'Halaman Edit Kategori'
            });

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/category');
        }
    },
    actionEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;

            await Category.findOneAndUpdate({ _id: id }, { name });

            req.flash('alertMessage', 'Berhasil mengubah kategori');
            req.flash('alertStatus', 'success');

            return res.redirect('/category');

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/category');
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;

            await Category.findOneAndDelete({ _id: id });

            req.flash('alertMessage', 'Berhasil menghapus kategori');
            req.flash('alertStatus', 'success');

            return res.redirect('/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/category');
        }
    }
};