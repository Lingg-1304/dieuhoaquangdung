const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: "dmasiceou",
  api_key: "396294689333812",
  api_secret: process.env.API_cloudinary, // Click 'View API Keys' above to copy your API secret
});

module.exports.upload = async (req, res, next) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    async function upload(req) {
      let result = await streamUpload(req);
      //   console.log(result);
      console.log(req.file.fieldname);
      req.body[req.file.fieldname] = result.url;
      next();
    }

    upload(req);
  } else {
    next();
  }
};
