const Player = require('../player/model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    signUp: async (req, res, next) => {
        try {
            const payload = req.body;

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
                        const player = new Player({
                            ...payload,
                            avatar: filename
                        });

                        await player.save();

                        delete player._doc.password;

                        return res.status(201).json({ data: player });
                    } catch (error) {
                        if( error && error.name === 'ValidationError' ) {
                            return res.status(422).json({
                                error: 1,
                                message: 'Terjadi kesalahan pada server', 
                                fields: error.errors
                            });
                        }
                        next(error);
                    }
                });
            } else {
                let player = new Player(payload);
                
                await player.save();

                delete player._doc.password;

                return res.status(201).json({ data: player });
            }

        } catch (error) {
            if( error && error.name === 'ValidationError' ) {
                return res.status(422).json({
                    error: 1,
                    message: 'Terjadi kesalahan pada server', 
                    fields: error.errors
                });
            }
            next(error);
        }
    },
    signIn: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const player = await Player.findOne({ email });

            if( !player ) {
                return res.status(401).json({
                    message: 'Email yang Anda masukkan tidak terdaftar'
                });
            }

            const matchPassword = bcrypt.compareSync(password, player.password);

            if( !matchPassword ) {
                return res.status(401).json({
                    message: 'Kata sandi salah'
                });
            }

            const token = jwt.sign({
                player: {
                    id: player.id,
                    username: player.username,
                    email: player.email,
                    name: player.name,
                    phoneNumber: player.phoneNumber,
                    avatar: player.avatar
                }
            }, config.jwtKey);

            return res.status(200).json({
                data: { token }
            });
        } catch (error) {
            if( error && error.name === 'ValidationError' ) {
                return res.status(422).json({
                    message: 'Terjadi kesalahan pada server', 
                    fields: error.errors
                });
            }
            next(error);
        }
    },
}