const mongoose = require("mongoose");

mongoose.connect(
  process.env.DB,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  (err) => {
    if (err) return console.log(err);
    console.log("mongoose connected");
  }
);

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: { type: Array, default: [] },
  commentcount: { type: Number, default: 0 },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
