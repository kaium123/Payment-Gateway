// server.js
const express = require('express');
const bodyParser = require('body-parser');

// Connect to databases
const { connect } = require('./database/postgres-database');


const app = require("./app/app");
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  try {
    res.status(200).json({ mesage: "Connections are established" });
  } catch (err) {
    res.status(500).json({ mesage: "Connections are not established" });
  }
});

const connectDB = async () => {
  try {
      await connect()
  } catch (err) {
      console.log(`DB error for error ${err}`);
      throw err;
  }
};

app.listen(port, async () => {
  try {
    await connectDB();
    console.log(`Server is listening on port ${port}`);
  } catch (err) {
    console.log("Server cannot be connected because of the error:");
    console.log(err);
  }
});
