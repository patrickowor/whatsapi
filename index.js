const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse request body
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ extended: true }));

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail", // Change as needed
    auth: {
        user: process.env.smtpmail, // Replace with your email
        pass: process.env.smtppassword // Replace with your email password or app password
    }
});

// Middleware to capture all requests
app.use((req, res, next) => {
    const requestData = {
        method: req.method,
        url: req.originalUrl,
        // headers: req.headers,
        body: req.body
    };

    // console.log("Incoming request:", requestData);

    // Email options
    const mailOptions = {
        from: process.env.smtpmail, // Replace with your email
        to: process.env.smtpmail, // Replace with recipient email
        subject: "New Request Captured",
        text: JSON.stringify(requestData, null, 2) // Formatting JSON as readable text
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });

    res.sendStatus(200)
    next();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
module.exports = app;