const cloudinary = require('cloudinary').v2;//v2 means version 2
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//config means to combine
//cloudinary.config => here we pass the configration detail
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,//key name by default should be same as given
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});



const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormat: ["png","jpg","jpeg"], // supports promises as well
    },
  });

  module.exports = {
    cloudinary,
    storage
  }