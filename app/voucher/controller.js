const Voucher = require('./model');
const Category = require('../category/model');
const Nominal = require('../nominal/model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };

            const voucher = await Voucher.find()
                .populate('category')
                .populate('nominals');
            
            return res.render('admin/voucher/view_voucher', { 
                voucher, 
                alert,
                name: req.session.user.name,
                title: 'Halaman Voucher'
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/voucher');
        }
    },
    viewCreate: async (req, res) => {
        try {
            const category = await Category.find();
            const nominal = await Nominal.find();

            return res.render('admin/voucher/create', { 
                category, 
                nominal,
                name: req.session.user.name,
                title: 'Halaman Tambah Voucher'
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/voucher');
        }
    },
    actionCreate: async (req, res) => {
        try {
            const { name, category, nominals } = req.body;
            if( req.file ) {
                let temp_path = req.file.path;
                let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename + '.' + originalExt
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`);

                const src = fs.createReadStream(temp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest);

                src.on('end', async () => {
                    try {
                        const voucher = new Voucher({
                            name,
                            thumbnail: filename,
                            category,
                            nominals
                        });

                        await voucher.save();

                        req.flash('alertMessage', 'Berhasil menambah voucher');
                        req.flash('alertStatus', 'success');
                        return res.redirect('/voucher');

                    } catch (error) {
                        req.flash('alertMessage', `${error.message}`);
                        req.flash('alertStatus', 'danger');
                        return res.redirect('/voucher');
                    }
                });
            } else {
                const voucher = new Voucher({
                    name,
                    category,
                    nominals
                });

                await voucher.save();

                req.flash('alertMessage', 'Berhasil menambah voucher');
                req.flash('alertStatus', 'success');
                return res.redirect('/voucher');
            }
            

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/voucher');
        }
    },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;

            const category = await Category.find();
            const nominal = await Nominal.find();
            
            const voucher = await Voucher.findOne({_id: id})
                .populate('category')       // --> Untuk relasi di MongoDB
                .populate('nominals');

            return res.render('admin/voucher/edit', { 
                voucher, 
                nominal, 
                category,
                name: req.session.user.name,
                title: 'Halaman Edit Voucher'
            });

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/voucher');
        }
    },
    actionEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, category, nominals } = req.body;
            
            if( req.file ) {
                let temp_path = req.file.path;
                let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename + '.' + originalExt
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`);

                const src = fs.createReadStream(temp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest);

                src.on('end', async () => {
                    try {

                        const voucher = await Voucher.findOne({_id: id});

                        let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
                        if( fs.existsSync(currentImage) ) {
                            fs.unlinkSync(currentImage);
                        }

                        await Voucher.findOneAndUpdate({_id: id},{
                            name,
                            thumbnail: filename,
                            category,
                            nominals
                        });

                        req.flash('alertMessage', 'Berhasil mengubah voucher');
                        req.flash('alertStatus', 'success');
                        return res.redirect('/voucher');

                    } catch (error) {
                        req.flash('alertMessage', `${error.message}`);
                        req.flash('alertStatus', 'danger');
                        return res.redirect('/voucher');
                    }
                });
            } else {
                await Voucher.findOneAndUpdate({_id: id},{
                    name,
                    category,
                    nominals
                });

                req.flash('alertMessage', 'Berhasil mengubah voucher');
                req.flash('alertStatus', 'success');
                return res.redirect('/voucher');
            }

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/voucher');
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;

            const voucher = await Voucher.findOne({_id: id});

            let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
            if( fs.existsSync(currentImage) ) {
                fs.unlinkSync(currentImage);
            }

            await Voucher.findOneAndDelete({ _id: id });

            req.flash('alertMessage', 'Berhasil menghapus voucher');
            req.flash('alertStatus', 'success');

            return res.redirect('/voucher');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/voucher');
        }
    },
    actionStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const voucher = await Voucher.findOne({_id: id});

            let voucherStatus = voucher.status === 'Y' ? 'N' : 'Y';

            await Voucher.findOneAndUpdate({_id: id}, {
                status: voucherStatus
            });

            req.flash('alertMessage', 'Berhasil mengubah status voucher');
            req.flash('alertStatus', 'success');

            return res.redirect('/voucher');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            return res.redirect('/voucher');
        }
    }
};
