const mongoose = require('mongoose');
const Article = mongoose.model('Article');

module.exports = {
    index: (req, res) => {
        res.render('home/index');
    },

    wall: (req, res) => {
        Article.find({}).limit(100).populate('author').sort('-date').then(articles => {
            res.render('home/wall',{articles: articles});
        })
    },

    devsInfoGet: (req, res) => {
        res.render('developers/info');
    },

};