const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const HASH_ROUND = 10;

const playerSchema = mongoose.Schema({
    email: {
        type: String,
        require: [true, 'email tidak boleh kosong']
    },
    name: {
        type: String,
        require: [true, 'nama tidak boleh kosong'],
        minLength: [3, 'Panjang nama harus 3 - 225 karakter'],
        maxLength: [225, 'Panjang nama harus 3 - 225 karakter']
    },
    username: {
        type: String,
        require: [true, 'nama tidak boleh kosong'],
        minLength: [3, 'Panjang username harus 3 - 225 karakter'],
        maxLength: [225, 'Panjang username harus 3 - 225 karakter']
    },
    password: {
        type: String,
        require: [true, 'password tidak boleh kosong'],
        minLength: [8, 'Panjang password harus 8 - 225 karakter'],
        maxLength: [225, 'Panjang password harus 8 - 225 karakter']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    },
    avatar: {
        type: String,
    },
    filename: {
        type: String,
    },
    phoneNumber: {
        type: String,
        require: [true, 'nomor telepon tidak boleh kosong'],
        minLength: [9, 'Panjang nomor telepon harus 9 - 13 karakter'],
        maxLength: [13, 'Panjang nomor telepon harus 9 - 13 karakter']
    },
    favorite: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
}, { timestamps: true });

playerSchema.path('email').validate(async function(value) {
    try {
        const count = await this.model('Player').countDocuments({ email: value })
        return !count;
    } catch (error) {
        throw error
    }
}, attr => `${attr.value} sudah terdaftar`);

playerSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND);
    next();
});

module.exports = mongoose.model('Player', playerSchema);