const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        require: [true, 'email tidak boleh kosong']
    },
    name: {
        type: String,
        require: [true, 'nama tidak boleh kosong']
    },
    password: {
        type: String,
        require: [true, 'password tidak boleh kosong']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'admin'
    },
    status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    },
    phoneNumber: {
        type: String,
        require: [true, 'nomor telepon tidak boleh kosong']
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
