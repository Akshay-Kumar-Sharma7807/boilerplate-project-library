/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const Book = require("../Book");
module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, (err, books) => {
        if (err) return console.log(err);
        res.json(books);
      });
    })

    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (title === undefined || title === "") {
        return res.send("missing required field title");
      }
      var book = new Book({
        title,
      });
      book.save((err, book) => {
        if (err) return console.log(err);
        res.json({
          _id: book._id,
          title: book.title,
        });
      });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      Book.find({}, (err, books) => {
        if (err) return console.log(err);
        books.map((book) => {
          book.remove((err, data) => {
            if (err) return console.log(err);
            if (data == null) {
              return console.log("data is null");
            }
          });
        });
        res.send("complete delete successful");
      });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      Book.findById(bookid, (err, book) => {
        if (err) {
          res.send("no book exists");
          return console.log(err);
        }
        if (book === null) {
          return res.send("no book exists");
        }
        res.json(book);
      });
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (comment === undefined || comment === "") {
        return res.send("missing required field comment");
      }
      Book.findById(bookid, (err, book) => {
        if (err) return console.log(err);
        if (book === null) {
          return res.send("no book exists");
        }
        book.comments.push(comment);
        book.save((err, data) => {
          if (err) return console.log(err);
          res.json(data);
        });
      });
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      Book.findByIdAndRemove(bookid, (err, data) => {
        if (err) return console.log(err);
        if (data === null) {
          return res.send("no book exists");
        }
        // console.log(data);
        res.send("delete successful");
      });
      //if successful response will be 'delete successful'
    });
};
