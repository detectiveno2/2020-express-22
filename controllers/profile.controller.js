const cloudinary = require("cloudinary").v2;

const db = require("../db");

module.exports.index = (req, res) => {
  let user = db
    .get("users")
    .find({ id: req.signedCookies.userId })
    .value();

  res.render("profile/index", {
    user: user
  });
};

module.exports.update = (req, res) => {
  let user = db
    .get("users")
    .find({ id: req.signedCookies.userId })
    .value();

  res.render("profile/update", {
    user: user
  });
};

module.exports.postUpdate = (req, res) => {
  if (!req.file) {
    cloudinary.uploader.upload(
      "https://cdn.glitch.com/e2965d3f-b268-4401-b2bc-49d59d42e86c%2Fdefault-avatar.png?v=1587825999712",
      function(error, result) {
        db.get("users")
          .find({ id: req.body.id })
          .assign({ avatarUrl: result.url })
          .write();
        console.log(req.body);
      }
    );
  } else {
    cloudinary.uploader.upload(req.file.path, function(error, result) {
      db.get("users")
        .find({ id: req.body.id })
        .assign({ avatarUrl: result.url })
        .write();
      console.log(req.body);
    });
  }

  res.redirect("/profile/index" + req.body.id);
};
