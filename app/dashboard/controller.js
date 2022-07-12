module.exports = {
    index: async (req, res) => {
        try {
            return res.render('index', {
                name: req.session.user.name,
                title: 'Halaman Dashboard'
            });
        } catch (error) {
            return res.send({
                message: error.message
            })
        }
    }
};