const mongoose = require('mongoose');
const User = mongoose.model('User');
const Role = mongoose.model('Role');
const encryption = require('./../../utilities/encryption');

module.exports = {
    all: (req,res) => {
        User.find({}).then(users => {

            for(let user of users) {
                user.isInRole('Admin').then(isAdmin => {
                    user.isAdmin = isAdmin;
                });
            }

            res.render('admin/user/all', {users: users})
        });
    },

    deleteGet: (req,res) => {
        let id = req.params.id;
        User.findById(id).then(user => {
            res.render('admin/user/delete', {userToDelete: user})
        });
    },

    deletePost: (req,res) => {
        let id = req.params.id;
        User.findOneAndRemove({_id: id}).then(user => {
            user.prepareDelete();
            res.redirect('/admin/user/all');
        })
    }
};