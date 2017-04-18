const Article = require('mongoose').model('Article');

function validateArticle(articleArgs, req) {
    let errorMsg = '';
    if (!req.isAuthenticated()) {
        errorMsg = 'You should be logged in to operate with articles!'
    } else if (!articleArgs.title) {
        errorMsg = 'Invalid title!';
    } else if (!articleArgs.content) {
        errorMsg = 'Invalid content!';
    }

    return errorMsg
}

module.exports = {

    createGet: (req, res) => {
        if (!req.isAuthenticated()) {
            let returnUrl = '/article/create';
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }
        res.render('article/create');
    },

    createPost: (req, res) => {
        let articleArgs = req.body;

        let errorMsg = validateArticle(articleArgs, req);

        if (errorMsg) {
            res.render('article/create', {error: errorMsg});
            return;
        }

        articleArgs.author = req.user.id;
        Article.create(articleArgs).then(article => {

            req.user.articles.push(article);
            req.user.save(err => {
                if (err) {
                    res.redirect('/', {error: err.message});
                } else {
                    res.redirect('/wall');
                }
            })
        })
    },

    detailsGet: (req, res) => {
        let id = req.params.id;

        Article.findById(id).populate('author').then(article => {
            res.render('article/details', article);
        })
    },

    editGet: (req, res) => {
        let id = req.params.id;

        Article.findById(id).then(article => {
            if (!req.user.isAuthor(article)) {
                res.render('home/index', {error: "You cannot edit this post!"});
            } else {
                res.render('article/edit', article)
            }
        });
    },

    editPost: (req, res) => {
        let id = req.params.id;

        let articleArgs = req.body;

        let errorMsg = validateArticle(articleArgs, req);

        if (errorMsg) {
            res.render('article/edit', {error: errorMsg})
        }
        else {
            Article.update({_id: id}, {$set: {title: articleArgs.title, content: articleArgs.content}})
                .then(updateStatus => {
                    res.redirect(`/article/details/${id}`);
                })
        }
    },

    deleteGet: (req,res) => {
        let id = req.params.id;

        Article.findById(id).then(article => {
            res.render('article/delete',article)
        });
    },
    deletePost: (req,res) => {
        let id = req.params.id;

        Article.findOneAndRemove({_id: id}).populate('author').then(article => {
            let author = article.author;

            let index = author.articles.indexOf(article.id0);

            if(index > 0 ){
                let errorMsg = 'Article was not found for that author!';
                res.render('article/delete', {error: errorMsg})

            } else {
                let count = 1;
                author.articles.splice(index,count);
                author.save().then(user => {
                    res.redirect('/wall')
                });
            }
        });
    }
};