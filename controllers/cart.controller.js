const shortid = require("shortid");

const db = require("../db");

module.exports.index = (req, res) => {
  let session = db
    .get("sessions")
    .find({ id: req.signedCookies.sessionId })
    .value();

  res.render("cart/index", {
    cart: session.cart
  });
};

module.exports.remove = (req, res) => {
  let session = db
    .get("sessions")
    .find({ id: req.signedCookies.sessionId })
    .value();

  for (let i = 0; i < session.cart.length; i++) {
    if (session.cart[i].id === req.params.id) {
      session.cart.splice(i, 1);
      break;
    }
  }

  db.get("sessions")
    .find({ id: req.signedCookies.sessionId })
    .write();
  res.redirect("/cart");
};

module.exports.hire = (req, res) => {
  let session = db
    .get("sessions")
    .find({ id: req.signedCookies.sessionId })
    .value();
  if ((session.cart = [])) {
    res.redirect("/books");
    return;
  }
  let user = db
    .get("users")
    .find({ id: req.signedCookies.userId })
    .value();
  for (let book of session.cart) {
    let transaction = {
      id: shortid.generate(),
      content: `${user.name} got ${book.title}.`,
      userId: user.id,
      bookId: book.id,
      isComplete: false
    };
    console.log(transaction);
    db.get("transactions")
      .push(transaction)
      .write();
  }
  session.cart = [];
  db.get("sessions")
    .find({ id: req.signedCookies.sessionId })
    .write();
  res.redirect("/transactions");
};
