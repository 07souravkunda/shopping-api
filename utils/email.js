const nodemailer = require('nodemailer');

const sendMail = async (emailId, token) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 587,
    secure: false,
    auth: {
      user: '896d5d909cb530',
      pass: '10fac59536cf69'
    }
  });
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: emailId, // list of receivers
    subject: 'Hello ✔', // Subject line
    text: `this is your password reset token ${token}`, // plain text body
    html: '<b>Hello world?</b>' // html body
  });
  console.log(info);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

module.exports = sendMail;
