const express = require("express");
const app = express();
const port = 3000;


app.use(express.json());

app.post("/review", (req, res) => {
  
  const requestBody = req.body;

  console.log("Received review request:", requestBody);

  
  res.status(200).json({
    message: "Review received successfully",
    yourData: requestBody,
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});