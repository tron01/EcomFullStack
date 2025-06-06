const formData = require('form-data');
const Mailgun = require('mailgun.js');


const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY, // secure via .env
});

const sendPasswordResetEmail = async (email, token) => {
  
 try {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    const data= await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: 'Support <postmaster@sandbox7fe71866c0604d139c5e1b7d79183909.mailgun.org>',
        to: email,
        subject: 'Reset Your Password',
        html: `<p>Click below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    });
    console.log(data);
    return data;
 } catch (error) {
        console.log(error);
 }


};

module.exports = { sendPasswordResetEmail };
