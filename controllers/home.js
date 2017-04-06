const mongoose = require('mongoose');
const Article = mongoose.model('Article');

module.exports = {
    index: (req, res) => {
        res.render('home/index');
    },

    wall: (req, res) => {
        Article.find({}).limit(6).populate('author').then(articles => {
            res.render('home/wall',{articles: articles});
        })
    },

};