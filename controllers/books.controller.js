const shortid = require("shortid");
var cloudinary = require("cloudinary").v2;

const db = require("../db");

module.exports.index = (req, res) => {
  let perPage = 4;
  let page = req.query.page || 1;
  let start = (page - 1) * perPage;
  let end = page * perPage;

  res.render("books/index", {
    books: db
      .get("books")
      .value()
      .slice(start, end),
    pageQuantity: Math.floor(db.get("books").value().length / perPage + 1)
  });
};

module.exports.create = (req, res) => {
  res.render("books/create");
};

module.exports.postCreate = async (req, res) => {
  req.body.id = shortid.generate();

  if (!req.file) {
    let result = await cloudinary.uploader.upload(
      "https://cdn.glitch.com/46ef95f0-e192-4c0d-b1de-dc836e53b5d3%2Ffavicon.png?v=1587549411189"
    );
    req.body.coverUrl = result.url;
  } else {
    let result = await cloudinary.uploader.upload(req.file.path);
    req.body.coverUrl = result.url;
  }

  db.get("books")
    .push(req.body)
    .write();
  res.redirect("/books");
};

module.exports.edit = (req, res) => {
  res.render("books/edit", {
    id: req.params.id
  });
};

module.exports.postEdit = async (req, res) => {
  if (!req.file) {
    var result = await cloudinary.uploader.upload(
      "https://cdn.glitch.com/46ef95f0-e192-4c0d-b1de-dc836e53b5d3%2Ffavicon.png?v=1587549411189"
    );
  } else {
    var result = await cloudinary.uploader.upload(req.file.path);
  }
  db.get("books")
    .find({ id: req.body.id })
    .assign({ title: req.body.title, coverUrl: result.url })
    .write();
  res.redirect("/books");
};

module.exports.delete = (req, res) => {
  db.get("books")
    .remove({ id: req.params.id })
    .write();
  res.redirect("/books");
};

module.exports.add = (req, res) => {
  let book = db.get('books').find({id: req.params.id}).value();
  let session = db.get('sessions').find({id: req.signedCookies.sessionId}).value();
  
  session.cart.push(book);
  
  db.get('sessions').find({id: req.signedCookies.sessionId}).write();
  
  res.redirect('/books');
}
