require("dotenv").config();

const tasks = require("./routes/tasks");
const users = require("./routes/users");
const polls = require("./routes/polls");

const connection = require("./db");

const express = require("express");
const cors = require("cors");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

connection();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://mern-poll-app.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const store = new session.MemoryStore();

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
    // store: store,
    name: "secret.ckname",
    cookie: {
      secure: true,
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

//include all the database tables/models
app.use("/api/tasks", tasks);
app.use("/api/users", users);
app.use("/api/polls", polls);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server Listening on Port ${port}`));
