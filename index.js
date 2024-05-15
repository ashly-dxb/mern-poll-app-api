require("dotenv").config();

const tasks = require("./routes/tasks");
const users = require("./routes/users");
const polls = require("./routes/polls");
const fileUploads = require("./routes/fileupload");

const connection = require("./db");

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// const cookieSession = require("cookie-session");

connection();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://mern-poll-app.onrender.com"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(process.cwd() + "/uploaded"));

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
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// app.set("trust proxy", 1);
// app.use(
//   cookieSession({
//     name: "__session",
//     keys: ["key1"],
//     maxAge: 24 * 60 * 60 * 1000,
//     secure: true,
//     httpOnly: true,
//     sameSite: "none",
//   })
// );

//include all the database tables/models
app.use("/api/tasks", tasks);
app.use("/api/users", users);
app.use("/api/polls", polls);
app.use("/api/files", fileUploads);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server Listening on Port ${port}`));
