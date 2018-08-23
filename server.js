const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/users");

const package = require("./package.json");
const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(require("./config/keys").MONGO_URI)
  .then(() => console.log(`> MongoDB connected`))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
require("./config/passport")(passport);

// Routes

app.get("/version", (req, res) => {
  res.json({ version: package.version });
});

app.use("/api", users);

// Start the server

app.listen(port, () => {
  console.log(`> Server running on port ${port}`);
});
