const nodemailer = require('nodemailer');
require('dotenv').config();

const mailler = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

module.exports = mailler