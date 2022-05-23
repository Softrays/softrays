const multer = require("multer");
const path = require("path");

// Configuring Our App to use Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/passport");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20000 },
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|git/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb("Error: Images Only", false);
    }
  },
}).single("passport");

module.exports = upload;
