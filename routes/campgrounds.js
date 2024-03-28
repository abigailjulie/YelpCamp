const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


const Campground = require('../models/campground');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

//SOME of these routes were grouped together
//The index
// router.get('/', catchAsync(campgrounds.index));

//moved because id needs to go before show
//New form
//router.get('/new', isLoggedIn, campgrounds.renderNewForm);

//This was refraccured to use controller
//this cannot be below id because order does matter
// router.get('/new', isLoggedIn, (req, res) => {
    //moved to another file as a middleware because you want to be able to use this in campgrounds and reviews
    // if(!req.isAuthenticated()){
    //     req.flash('error', 'You must be signed in');
    //     return res.redirect('/login');
    // }
//     res.render('campgrounds/new');
// });

//grouped above
//Create campground
// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

//This was refraccured to use controller
//even though you shoulddn't even be able to get here without logging in it's good practice to add the isLoggedIn middleware so people can't get there other ways
// router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
//     const campground = new Campground(req.body.campground); //this creates a new model
//     campground.author = req.user._id; //to associate the post with the user
//     await campground.save();
//     req.flash('success', 'Successfully made a new campground!');
//     res.redirect(`/campgrounds/${campground._id}`)
// }));

//grouped above
//Show Campground
// router.get('/:id', catchAsync(campgrounds.showCampground));

//This was refraccured to use controller
// router.get('/:id', catchAsync(async (req,res) => {
//     //now to incoroate the find by id so it's showing you a specific campground
//     //for a more complex app you cn store a username on the review schema
//     const campground = await Campground.findById(req.params.id).populate({
//     path: 'reviews',
//     populate: {
//         path: 'author'
//         }
//     }).populate('author');
//     console.log(campground);
//     if(!campground){
//         req.flash('error', 'cannot find that campground!');
//         return res.redirect('/campgrounds'); //return this otherwise you'll render campground show the next thing below
//     }
//     res.render('campgrounds/show', { campground });
// }));

// Edit a campground, this is using a controller
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

//grouped above
//Update Campground
// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

//to make sure you can send a patch request from a fake put req route using method override
// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     //const campground = await Campground.findById(id);
//     //no longer want to find and update at the same time becuase you want to check if it's the author
//     const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
//     req.flash('success', 'Successfully updated campground!');
//     res.redirect(`/campgrounds/${campground._id}`)
// }));

//Delete Campground
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//this is using controller
//restful pattern means the route is going to be a delete route
//needs to have the iid included, not a get route
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
//     const { id } = req.params; //this basically stands for req.params.id
//     await Campground.findByIdAndDelete(id);
//     req.flash('success', 'Successfully deleted campground!');
//     res.redirect('/campgrounds');
// }));

module.exports = router;