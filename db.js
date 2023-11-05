const mongoose = require("mongoose");
const password = process.env.MONGODB_PASS;

// console.log("password:" + password + "##");

const dbURL =
  "mongodb+srv://ashlythomas:" +
  password +
  "@cluster0.nobtacb.mongodb.net/react-node-todolist?retryWrites=true&w=majority"; // server db

// const dbURL = "mongodb://localhost/react-node-todolist"; // local db

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
      "345MosattuKittyu@*$#HeK" + process.env.MONGODB_PASS + "304030!!*%K"
    );
  } catch (error) {
    console.log("Could not connect to MongoDB database.", error);
  }
};
