const mailjet = require('node-mailjet');

const mailjetClient = mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,  // Your Mailjet Public Key
  process.env.MJ_APIKEY_PRIVATE  // Your Mailjet Private Key
);

const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const resetLink = `https://yourfrontend.com/reset-password/${resetToken}`;

  try {
    const request = await mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'sng22mca02@sngce.ac.in',
              Name: 'ecomshoping',
            },
            To: [
              {
                Email: toEmail,
              },
            ],
            Subject: 'Reset Your Password - EcomShopping',
            TextPart: `You requested a password reset. Click this link to reset your password: ${resetLink}`,
            HTMLPart: `
              <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 48px;">
        <div
            style="max-width: 520px; margin: 40px auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); padding: 40px 32px;">
            <h2 style="color: #2d3748; text-align: center; margin-bottom: 32px;">Reset Your Password</h2>
            <div style="color: #4a5568; font-size: 17px; margin-bottom: 24px; text-align: left;">
                <span style="color: #201e1e;">Hi,</span><br>
                We received a request to reset your password for your Ecom account.
            </div>
            <div style="text-align: center; margin: 32px 0;">
                <a href="${resetLink}"
                    style="display: inline-block; padding: 16px 32px; background: #3182ce; color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
                    Reset Password
                </a>
            </div>
            <p style="color: #718096; font-size: 15px; margin-bottom: 12px; text-align: center;">
                If the button above does not work, copy and paste this link into your browser:
            </p>
            <p style="word-break: break-all; color: #3182ce; font-size: 15px; margin-bottom: 24px; text-align: center;">
                ${resetLink}
            </p>
            <p style="color: #718096; font-size: 14px; margin-bottom: 24px; text-align: center;">
                If you did not request a password reset, please ignore this email.<br>
                This link will expire in 15 minutes.
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 40px 0;">
            <p style="color: #a0aec0; font-size: 13px; text-align: center;">
                &copy; <span id="year"></span> EcomShopping. All rights reserved.
            </p>
        </div>
    </div>
            `,
          },
        ],
      });

    console.log('Email sent:', request.body);
  } catch (err) {
    console.error('Email send failed:', err.statusCode, err.message);
    throw err;
  }
};

module.exports = { sendPasswordResetEmail };
