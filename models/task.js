const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    task_name: {
        type: String,
        required: true,
    },
    created_date: {
        type: Date,
        default: Date.now(),
    },
    updated_date: {
        type: Date,
        default: Date.now(),
    },
    userID: {
        type: Number,
        required: true,
        default: 100,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("tasks", taskSchema);
