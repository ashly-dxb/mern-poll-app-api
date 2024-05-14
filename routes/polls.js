const Poll = require("../models/poll");

const express = require("express");
const router = express.Router();

// router.use((_, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin,X-Requested-With,Content-type,Accept"
//   );
//   next();
// });

router.get("/test", (req, res) => res.send("Hello World"));

router.get("/getpoll/:id", async (req, res) => {
  const pollID = req.params.id;
  try {
    const pollDetail = await Poll.findOne({ pollID: pollID }).lean().exec();
    res.send(pollDetail);
  } catch (error) {
    res.send(error);
  }
});

delay = (delayMilliSec) => {
  return new Promise((resolve) => setTimeout(resolve, delayMilliSec));
};

router.get("/listpoll", async (req, res) => {
  // await delay(3000);
  try {
    // const polls = await Poll.find().lean().exec();
    const polls = await Poll.aggregate([
      { $unwind: "$options" },
      {
        $project: {
          _id: 1,
          pollID: 1,
          question: 1,
          formattedDate: {
            $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdDate" },
          },
          totalVotes: {
            $sum: "$options.count",
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          pollID: { $first: "$pollID" },
          question: { $first: "$question" },
          createdDate: { $first: "$formattedDate" },
          totalVotes: { $sum: "$totalVotes" },
        },
      },
      { $sort: { totalVotes: -1 } },
    ]);
    // .lean()
    // .exec();
    res.send(polls);
  } catch (error) {
    res.send(error);
  }
});

router.post("/createpoll", async (req, res) => {
  const x = req.body.question.question;
  const y = req.body.options;

  var data = new Poll({
    pollID: req.body.question.id,
    question: req.body.question.question,
    options: req.body.options,
  });

  // try {
  //   const poll = await new Poll(data).save();
  //   res.send(poll);
  // } catch (error) {
  //   res.send(error);
  // }

  data
    .save()
    .then((response) => {
      let responseJSON = JSON.stringify(response, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      );
      let responseJSON2 = responseJSON.replace(/\\"/g, '"');
      let responseJSON3 = JSON.parse(responseJSON2);
      res.json(responseJSON3);
    })
    .catch((error) => {
      res.send(error);
    });
});

router.post("/editpoll", async (req, res) => {
  const pollID = req.body.pollID;
  const x = req.body.question.question;
  const y = req.body.options;

  try {
    const poll = await Poll.findOneAndUpdate(
      { pollID: pollID },
      { question: x, options: y }
    );

    res.send(poll);
  } catch (error) {
    res.send(error);
  }

  // .then((response) => res.send(response))
  // .catch((error) => res.send(error));
});

router.post("/deletepoll", (req, res) => {
  Poll.findOneAndRemove({ _id: req.body.key })
    .then((response) => {
      res.send({ success: true });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/links", async (req, res) => {
  const pollID = req.body.id;

  try {
    const polls = await Poll.findOne({ pollID: pollID }).lean().exec();
    res.send(polls);
  } catch (error) {
    res.send(error);
  }
});

router.post("/setvote", (req, res) => {
  const pollID = req.body.pollID;

  Poll.updateOne(
    { pollID: pollID, "options.id": req.body.id },
    { $set: { "options.$.count": req.body.count } }
  )
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
