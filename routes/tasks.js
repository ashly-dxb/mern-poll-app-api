const Task = require("../models/task");

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ created_date: -1 }).exec(); //  .limit(5)
    res.send(tasks);
  } catch (error) {
    res.send(error);
  }
});

router.get("/:id", async (req, res) => {
  const taskID = req.params.id;

  try {
    const details = await Task.findOne({ _id: taskID }).lean().exec();
    res.send(details);
  } catch (error) {
    res.send(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const task = await new Task(req.body).save();
    res.send(task);
  } catch (error) {
    res.send(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate({ _id: req.params.id }, req.body);
    res.send(task);
  } catch (error) {
    res.send(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    res.send(task);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
