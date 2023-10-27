require("dotenv").config();
const sesClient = require("./aws-config");
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = require("./config");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'https://main.d3fyhkuehrb5u9.amplifyapp.com',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(
    `[${timestamp}] ${req.method} request to ${req.path} from ${req.ip}`
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to my backend!");
});

app.get("/projects", (req, res) => {
  fs.readFile("projects.json", "utf8", (err, data) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(JSON.parse(data));
  });
});

const { SendEmailCommand } = require("@aws-sdk/client-ses");

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  const emailParams = {
    Source: "pensivepasta@gmail.com",
    Destination: {
      ToAddresses: ["pensivepasta@gmail.com"],
    },
    Message: {
      Body: {
        Text: { Data: `Name: ${name}\nEmail: ${email}\nMessage: ${message}` },
      },
      Subject: { Data: "New Contact Form Submission" },
    },
  };

  try {
    const data = await sesClient.send(new SendEmailCommand(emailParams));
    console.log("Email sent successfully:", data);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email.");
  }
});

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
