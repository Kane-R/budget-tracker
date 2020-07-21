const express = require("express");
const compression = require("compression");

// Database Connection Request
require('dotenv/config');
const connectDB = require("./config/connectDB.js");

// Bring in models
const db = require("./models");

// Create an instance of the express app.
let app = express();

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 9090;


/******************************* MiddleWare  ****************************/


//GET REQUESTS

app.get("/api/transaction", (req,res) => {
  db.Transaction.find({})
  .then(dbData => {
    res.json(dbData);
  })
  .catch(err => {
    res.json(err);
  });
});

app.post("/api/transaction", (req,res) => {
  let data = req.body;
  //console.log(data);

  db.Transaction.create({
    date: data.date,
    name: data.name,
    value: data.value
    }).then(dbUpdate => {
      res.json(dbUpdate);
    })
    .catch(err => {
      res.json(err);
  });
});

app.post("/api/transaction/bulk", (req,res) => {
  let data = req.body;

  db.Transaction.collection.insertMany(data)
  .then(dbUpdate => {
    res.json(dbUpdate);
  })
  .catch(err => {
    res.json(err);
  });

});


/******************************* Connect to db  ****************************/
connectDB()

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});