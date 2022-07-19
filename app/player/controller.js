const Player = require('./model');
const Voucher = require('../voucher/model');

module.exports = {
    landingPage: async(req, res) => {
        try {
            const voucher = await Voucher.find()
                .select('_id name status category thumbnail')
                .populate('category');
            
            return res.status(200).json({
                data: voucher
            });
        } catch (error) {
            console.log(`[!] ${error.message}`);
            return res.status(500).json({
                message: 'Terjadi kesalahan pada server'
            });
        }
    },
    detailPage: async(req, res) => {
        try {
            const { id: voucherID } = req.params;
            const voucher = await Voucher.findOne({ _id: voucherID })
                .populate('category')
                .populate('nominals')
                .populate('user', '_id name phoneNumber');

            if( !voucher ) {
                return res.status(404).json({
                    message: 'Voucher tidak ditemukan!'
                });
            }

            return res.status(200).json({
                data: voucher
            });
        } catch (error) {
            console.log(`[!] ${error.message}`);
            return res.status(500).json({
                message: 'Terjadi kesalahan pada server'
            });
        }
    }
}