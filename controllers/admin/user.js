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


    editGet: (req,res) => {
        let id = req.params.id;

        User.findById(id).then(user => {
            Role.find({}).then(roles => {
                for (let role of roles) {
                    if(user.roles.indexOf(role.id) !== -1){
                        role.isCheked = true;
                    }
                }
                res.render('admin/user/edit', {user: user, roles: roles})
            })
        })
    },

    editPost: (req,res) => {
        let id = req.params.id;
        let editArgs = req.body;

        User.findOne({email:editArgs.email, _id: {$ne: id}}).then(user => {
            let errorMsg = '';
            if(user) {
                errorMsg = 'User with the same username exists!';
            } else if(!editArgs.email){
                errorMsg = 'Email cannot be null!';
            } else if(!editArgs.fullName){
                errorMsg = 'Name cannot be null!';
            } else if(editArgs.password !== editArgs.confirmedPassword){
                errorMsg = 'Passwords do not match!';
            }

            if(errorMsg){
                editArgs.error = errorMsg;
                res.render('admin/user/edit',editArgs);

            }else{
                Role.find({}).then(roles => {


                    let newRoles = roles.filter(role => {
                        return editArgs.roles.indexOf(role.name) !== -1;
                    }).map(role =>{
                        return role.id;
                    });

                    User.findOne({_id:id}).then(user => {
                        user.email = editArgs.email;
                        user.fullname = editArgs.fullName;

                        let passwordHash = user.passwordHash;
                        if(editArgs.password) {
                            passwordHash = encryption.hashPassword(editArgs.password, user.salt);
                            user.passwordHash = passwordHash;
                        }
                        user.roles = newRoles;
                        user.email = editArgs.email;
                        user.fullName = editArgs.fullName;
                        user.save((err) => {
                            if(err){
                                res.redirect('/');
                            } else{
                                res.redirect('/admin/user/all');
                            }
                        })
                    })
                })
            }
        })
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