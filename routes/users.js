const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware'); //this is added post colt's course
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

//SOME of these were grouped together
//register form
//router.get('/register', users.renderRegister);

//refractured for controller
// router.get('/register', (req, res) => {
//     res.render('users/register');
// });

//actually register
//router.post('/register', catchAsync(users.register));

//refractured in controllers
// router.post('/register', catchAsync(async (req, res, next) => {
//     try{
//         const { email, username, password } = req.body;
//         const user = new User({ email, username });
//         const registeredUser = await User.register(user, password);
//         req.login(registeredUser, err => {
//             if (err) return next(err); //becuase you can't await , not supported
//             req.flash('success', 'Welcome to Yelp Camp!');
//             res.redirect('/campgrounds');
//         })
//     } catch(e){
//         req.flash('error', e.message)
//         res.redirect('register')
//     }
// }));

//serves a form
// router.get('/login', users.renderLogin);

//refractured to controller
// router.get('/login', (req, res) => {
//     res.render('users/login');
// })

//actually logs in
// router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

//refractured to controller
// router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
//     req.flash('success', 'Welcome Back!');
//     const redirectUrl = res.locals.returnTo || '/campgrounds'; //this is added post colt's course
//     delete req.session.returnTo;
//     res.redirect(redirectUrl);
// })

//logout
router.get('/logout', users.logout);

//refractured to controller
// router.get('/logout', (req, res, next) => {
//     req.logout(function (err) {
//         if (err) {
//             return next(err);
//         }
//         req.flash('success', 'Goodbye!');
//         res.redirect('/campgrounds');
//     });
// }); 

module.exports = router;
