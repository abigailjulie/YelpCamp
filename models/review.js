const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

//this is a one to many relationship
//we will embed an array of object ids in each campground
//you could have thousands of reviews
//so you added review to the campground schema

module.exports = mongoose.model('Review', reviewSchema);
