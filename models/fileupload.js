const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileuploadSchema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  originalname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  uploadedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("fileuploads", fileuploadSchema);
