require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');

const { setFees, computeFee } = require("./handlers");
const app = express();
const port = process.env.PORT || 9000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/fees", setFees);
app.post("/compute-transaction-fee", computeFee);

app.listen(port, () => {
  console.log(`HTTP running on port ${port}`);
})
