const nodemailer = require("nodemailer");
exports.sendMail = async function (email_to, practice, staff, header, content) {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  let mailOptions = {
    from: '"' + staff + '" <' + process.env.EMAIL + ">",
    to: email_to,
    subject: "[" + practice + "] " + header,
    text: content,
  };
  return transporter.sendMail(mailOptions);
};
