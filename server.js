const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/users");

const package = require("./package.json");
const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(require("./config/keys").MONGO_URI)
  .then(() => console.log(`> MongoDB connected`))
  .catch(err => console.log(err));

// Routes

app.get("/version", (req, res) => {
  res.json({ version: package.version });
});

app.use("/api/users", users);

// Start the server

app.listen(port, () => {
  console.log(`> Server running on port ${port}`);
});
