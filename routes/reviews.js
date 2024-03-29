const express = require('express');
const router = express.Router({ mergeParams: true }); //because the parameters in the apps file and review file were separate so the value was showing up as null for review
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');

const { reviewSchema } = require('../schemas.js');

const reviews = require('../controllers/reviews');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

//moved to middlewar file
//make this a funcation becuase there will be more places you'd want to validate
// const validateReview = (req, res, next) => {
//     const {error} = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',') //because details is an object, so you map over it to turn it into an array and join them with commas in case there are multiple
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }

//Creates review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

//Was refractured into a controller
// router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id);
//     const review = new Review(req.body.review);
//     review.author = req.user._id;
//     campground.reviews.push(review);
//     await review.save();
//     await campground.save();
//     req.flash('success', 'Successfully created a new review!')
//     res.redirect(`/campgrounds/${campground._id}`);
// }))

//Delete Review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

//refractured using controllers
// router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//     await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId); 
//     req.flash('success', 'Successfully deleted review!');
//     res.redirect(`/campgrounds/${id}`);
// }))

module.exports = router;