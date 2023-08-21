const mongoose = require("mongoose");

module.exports = async () => {
  try {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    };

    await mongoose.connect(
      "mongodb://localhost/react-node-todolist",
      connectionParams
    );

    console.log("Connected to MongoDB database.");
  } catch (error) {
    console.log("Could not connect to database.", error);
  }
};
