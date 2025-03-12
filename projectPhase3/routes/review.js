const express = require("express");
const router =  express.Router({mergeParams : true});//mergeParams - Preserve the req.params values from the parent router. If the parent and the child have conflicting param names, the child’s value take precedence.
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");
const review = require("../models/review.js");

//Reviews (Post route)
//2- for reviews
 //without server side validation we can send empty review from other source like hoppscotch or postman which will be saved directly in DB  but now empty review not saved from any source
router.post("/",validateReview,isLoggedIn, wrapAsync(reviewController.createReview)
);

//Reviews (Delete route)
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview)
);

module.exports = router;
