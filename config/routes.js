const userController = require('./../controllers/user');
const articleController = require('./../controllers/article');
const homeController = require('./../controllers/home');


module.exports = (app) => {
    app.get('/', homeController.index);

    app.get('/wall', homeController.wall);

    app.get('/developers/info', homeController.devsInfoGet);

    app.get('/user/register', userController.registerGet);
    app.post('/user/register', userController.registerPost);

    app.get('/user/login', userController.loginGet);
    app.post('/user/login', userController.loginPost);

    app.get('/article/create',articleController.createGet);
    app.post('/article/create',articleController.createPost);

    app.get('/user/logout', userController.logout);

    app.get('/user/details', userController.detailsGet);

    app.get('/article/details/:id', articleController.detailsGet);

    app.get('/article/edit/:id', articleController.editGet);
    app.post('/article/edit/:id', articleController.editPost);

};

