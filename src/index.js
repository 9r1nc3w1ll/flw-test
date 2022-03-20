const express = require("express");
const bodyParser = require('body-parser');

const { setFees } = require("./handlers");
const app = express();
const port = 9000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/fees", setFees);

app.listen(port, () => {
  console.log(`HTTP running on port ${port}`);
})
