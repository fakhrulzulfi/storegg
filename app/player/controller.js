const Player = require('./model');
const Voucher = require('../voucher/model');
const Category = require('../category/model');
const Nominal = require('../nominal/model');
const Bank = require('../bank/model');
const Payment = require('../payment/model');
const Transaction = require('../transaction/model');

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
    },
    category: async (req, res) => {
        try {
            const category =  await Category.find();
            
            return res.status(200).json({
                data: category
            });
        } catch (error) {
            console.log(`[!] ${error.message}`);
            return res.status(500).json({
                message: 'Terjadi kesalahan pada server'
            });
        }
    },
    checkout: async (req, res) => {
        try {
            const {
                accountUser, 
                name, 
                nominal: nominalID, 
                voucher: voucherID, 
                payment: paymentID, 
                bank: bankID,
            } = req.body;

            const checkVoucher = await Voucher.findOne({ _id: voucherID })
                .select('_id name category thumbnail user')
                .populate('user')
                .populate('category');
            if( !checkVoucher ) res.status(404).json({ message: 'Voucher game tidak ditemukan' });

            const checkPayment = await Payment.findOne({ _id: paymentID });
            if( !checkPayment ) res.status(404).json({ message: 'Payment tidak ditemukan' });

            const checkBank = await Bank.findOne({ _id: bankID });
            if( !checkBank ) res.status(404).json({ message: 'Bank tidak ditemukan' });

            const checkNominal = await Nominal.findOne({ _id: nominalID });
            if( !checkNominal ) res.status(404).json({ message: 'Nominal tidak ditemukan' });

            const tax = checkNominal._doc.price * (10/100);
            const value = checkNominal._doc.price - tax

            const payload = {
                historyVoucherTopup: {
                    gameName: checkVoucher._doc.name,
                    category: checkVoucher._doc.category?.name || '',
                    thumbnail: checkVoucher._doc.thumbnail,
                    coinName: checkNominal._doc.coinName,
                    coinQuantity: checkNominal._doc.coinQuantity,
                    price: checkNominal._doc.price,
                },
                historyPayment: {
                    name: checkBank._doc.name,
                    type: checkPayment._doc.type,
                    bankName: checkBank._doc.name,
                    noRekening: checkBank._doc.noRekening,
                },
                name,
                accountUser,
                tax,
                value,
                player: req.player._id,
                historyUser: {
                    name: checkVoucher._doc.user.name,
                    phoneNumber: checkVoucher._doc.user?.phoneNumber || '',
                },
                category: checkVoucher._doc.category?._id,
                user: checkVoucher._doc.user?._id,
            };

            const transaction = new Transaction(payload);
            await transaction.save();

            return res.status(201).json({
                data: payload,
            });

        } catch (error) {
            console.log(`[!] ${error.message}`);
            return res.status(500).json({
                message: 'Terjadi kesalahan pada server'
            });
        }
    },
}