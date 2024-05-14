const mongoose = require("mongoose");
const password = process.env.MONGODB_PASS;

const dbURL =
  "mongodb+srv://ashlythomas:" +
  password +
  "@cluster0.nobtacb.mongodb.net/react-node-todolist?retryWrites=true&w=majority"; // server db

// const dbURL = "mongodb://localhost/react-node-todolist"; // local mongodb

module.exports = async () => {
  try {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    };

    await mongoose.connect(dbURL, connectionParams);

    console.log("Connected to MongoDB database.");

    console.log(
      "MyTest",
      "345MosattuKittyu@*$#HeKyuopenerSee" +
        process.env.MONGODB_PASS +
        "monk304030!!*%K"
    );
  } catch (error) {
    console.log(
      "Could not connect to MongoDB database. Check IP in server!",
      error
    );

    // https://cloud.mongodb.com/v2/64ac0903f95ff95f3e392d85#/security/network/accessList
  }
};
