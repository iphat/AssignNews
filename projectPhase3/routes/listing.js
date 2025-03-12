const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")
const listingController = require("../controllers/listing.js");
const multer  = require('multer')//Multer is a node.js middleware for handling multipart/form-data,which is primarily used for uploading files.
// const upload = multer({ dest: 'uploads/' });//multer create a folder uploads & store parsed files in it 
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});//now multer by default save our file to the cloudinary storage

//validateListing,
//we combine same path routes in one route here we combine "get" and "post" routes of index route & create route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.createListing)
  );
// .post( upload.single('listing[image]'),(req,res) => {
//   res.send(req.file);//req.file is  used to access the file that is uploaded same as req.body is used to access the data that is uploaded
// });

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);  

//
router.route ("/:id") 
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListings))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));


  
  //Edit Route
  router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm)
);


  //Show Route
  //becz of "/listings/:id" so in "/listings/new" app.js  take /new as 'id' so we put "new route" upper side of "show route"
  // router.get("/:id",wrapAsync(listingController.showListing)
  // );
  
  // //custom error handling is applied on "create route"  
  // //Create Route
  // router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing)
  // );

  // //Update Route
  // router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListings)
  // );

//   //Delete Route
//   router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.deleteListing)
// );
  module.exports = router;