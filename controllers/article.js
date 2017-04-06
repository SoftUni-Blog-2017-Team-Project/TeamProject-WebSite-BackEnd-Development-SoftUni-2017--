const Article = require('mongoose').model('Article');

function validateArticle( articleArgs, req) {
    let errorMsg = '';
    if(!req.isAuthenticated()){
        errorMsg = 'You should be logged in to operate with articles!'
    } else if (!articleArgs.title){
        errorMsg = 'Invalid title!';
    } else if (!articleArgs.content){
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
            req.user.articles.push(article.id);
            req.user.save(err => {
                if (err) {
                    res.redirect('/', {error: err.message});
                } else {
                    res.redirect('/');
                }
            })
        })
    }
};