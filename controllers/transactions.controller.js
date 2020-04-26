const shortid = require("shortid");

const db = require("../db");

module.exports.index = (req, res) => {
  let perPage = 4;
  let page = req.query.page || 1;
  let start = (page - 1) * perPage;
  let end = page * perPage;

  let user = db
    .get("users")
    .find({ id: req.signedCookies.userId })
    .value();

  if (user.isAdmin) {
    res.render("transactions/index", {
      transactions: db
        .get("transactions")
        .value()
        .slice(start, end),
      pageQuantity: Math.floor(
        db.get("transactions").value().length / perPage + 1
      )
    });
    return;
  }

  let transactions = db
    .get("transactions")
    .value()
    .filter(transaction => {
      return transaction.userId === user.id;
    });

  res.render("transactions/index", {
    transactions: transactions.slice(start, end),
    pageQuantity: Math.floor(
      db.get("transactions").value().length / perPage + 1
    )
  });
};

module.exports.create = (req, res) => {
  res.render("transactions/create", {
    users: db.get("users").value(),
    books: db.get("books").value()
  });
};

module.exports.postCreate = (req, res) => {
  let user = db
    .get("users")
    .find({ id: req.body.userId })
    .value();
  let book = db
    .get("books")
    .find({ id: req.body.bookId })
    .value();
  let transaction = {
    id: shortid.generate(),
    content: `${user.name} got ${book.title}.`,
    userId: user.id,
    bookId: book.id,
    isComplete: false
  };
  db.get("transactions")
    .push(transaction)
    .write();
  res.redirect("/transactions");
};

module.exports.complete = (req, res) => {
  db.get("transactions")
    .find({ id: req.params.id })
    .assign({ isComplete: true })
    .write();
  res.redirect("..");
};
