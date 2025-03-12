const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

//Reviews (Post route)
module.exports.createReview = async(req,res) => {
    console.log(req.params.id);
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
  // this person is the author of the review
   newReview.author = req.user._id;
  //console.log(newReview);

   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();

   req.flash("success", "New review created");
   res.redirect(`/listings/${listing._id}`);
};


//Reviews (Delete route)
module.exports.deleteReview = async(req,res) => {
    let {id, reviewId} = req.params;

    //$pull operator removes from an existing array all instances of a value or value that matche a specified condition
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "review deleted");
    res.redirect(`/listings/${id}`);
};