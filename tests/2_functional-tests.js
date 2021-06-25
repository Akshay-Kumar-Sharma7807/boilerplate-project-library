/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */
const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function (done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */
  let id = "";
  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({
              title: "a new book",
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, "the body should be object");
              id = res.body._id;
            });
          done();
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, "the body should be object");
              assert.equal(res.text, "missing required field title");
            });
          done();
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "the body should be a Array");
          });
        done();
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/ababe7492abababa483aaa5a")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, "the body should be object");
            assert.equal(res.text, "no book exists");
          });
        done();
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get("/api/books/" + id)
          .end((err, res) => {
            assert.equal(res.status, 200);
            // assert.isObject(res.body, "the body should be object");
            // assert.equal(res.text, "no book exists");
          });
        done();
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          chai
            .request(server)
            .post("/api/books/" + id)
            .send({
              comment: "new comment",
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, "the body should be array");
              assert.property(res.body, "comments");
              assert.equal(
                res.body.comments[res.body.comments.length - 1],
                "new comment"
              );
              // assert.equal(res.text, "no book exists");
            });
          done();
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          chai
            .request(server)
            .post("/api/books/" + id)
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, "the body should be object");
              assert.equal(res.text, "missing required field comment");
            });
          done();
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          chai
            .request(server)
            .post("/api/books/" + "ababe7492abababa483aaa5a")
            .send({
              comment: "new comment",
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, "the body should be object");
              assert.equal(res.text, "no book exists");
            });
          done();
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .delete("/api/books/" + id)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "delete successful");
          });
        done();
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        chai
          .request(server)
          .delete("/api/books/" + "ababe7492abababa483aaa5a")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
          });
        done();
      });
    });
  });
});
