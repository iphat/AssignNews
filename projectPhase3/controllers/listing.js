const Listing = require("../models/listing.js");

//index route
module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
  };

//new route
module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

//show route
module.exports.showListing = async(req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
      if(!listing){
        req.flash("error","listing does not exists");
        res.redirect("/listings");
      }
      console.log(listing);
      res.render("listings/show.ejs", { listing });
    };

//create route
module.exports.createListing = async(req,res,next) => {//wrapAsync function is better way to write try & catch
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url,"....",filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;//it add owner id to the new listing when it is created
    newListing.image = {url, filename};//These 2 values added in image
     await newListing.save();
    req.flash("success","New Listing created");
     res.redirect("/listings");
  };    

//edit route
module.exports.renderEditForm = async(req,res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id);
  
if(!listing){
    req.flash("error","listing does not exists");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  //add the blur effect on image on edit page
  originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250"); 
  res.render("listings/edit.ejs",{listing, originalImageUrl});
};

//update route
module.exports.updateListings = async(req,res) => {
  // if(!req.body.listing){
  //     throw new ExpressError(400,"send valid data for listing ");
  // }
 let {id} = req.params;
  let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});//(...)is a spread opertator      
  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
  }


  req.flash("success", "listing updated");
  // res.redirect("/listings");
  res.redirect(`/listings/${id}`);//for redirect at "show" page
};

//delete route
module.exports.deleteListing = async(req,res) => {
      let {id} = req.params;
      let deleteListing = await Listing.findByIdAndDelete(id);
      req.flash("success","listing deleted");
      res.redirect("/listings");
      console.log(deleteListing);
  };