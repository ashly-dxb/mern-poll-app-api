const mongoose = require("mongoose");
// const Int32 = require("mongoose-int32");
const Schema = mongoose.Schema;

const pollSchema = new Schema({
  pollID: {
    type: String,
    unique: true,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      id: { type: String, unique: true },
      options: { type: String },
      count: { type: BigInt, default: 0 },
    },
  ],
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("polls", pollSchema);
