const Player = require('../player/model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');

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
}