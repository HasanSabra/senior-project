require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"WiseVote" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email Address - WiseVote E-Voting System",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification - WiseVote</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
              
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }
              
              body {
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  background-color: #0E0E0E;
                  color: #FFFFFF;
                  line-height: 1.6;
              }
              
              .email-container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: #1A1A1A;
                  border: 1px solid #333333;
                  border-radius: 16px;
                  overflow: hidden;
              }
              
              .email-header {
                  background: linear-gradient(135deg, #6C2BD9 0%, #9D5CFF 100%);
                  padding: 40px 30px;
                  text-align: center;
              }
              
              .logo {
                  font-size: 28px;
                  font-weight: 700;
                  color: #FFFFFF;
                  margin-bottom: 16px;
              }
              
              .logo-subtitle {
                  font-size: 16px;
                  font-weight: 500;
                  color: rgba(255, 255, 255, 0.9);
                  opacity: 0.9;
              }
              
              .email-content {
                  padding: 40px 30px;
              }
              
              .welcome-title {
                  font-size: 28px;
                  font-weight: 700;
                  color: #FFFFFF;
                  margin-bottom: 16px;
                  text-align: center;
              }
              
              .welcome-subtitle {
                  font-size: 16px;
                  color: #CCCCCC;
                  text-align: center;
                  margin-bottom: 32px;
              }
              
              .verification-box {
                  background: #2A2A2A;
                  border: 1px solid #333333;
                  border-radius: 12px;
                  padding: 30px;
                  text-align: center;
                  margin: 32px 0;
              }
              
              .verification-title {
                  font-size: 18px;
                  font-weight: 600;
                  color: #FFFFFF;
                  margin-bottom: 16px;
              }
              
              .verification-text {
                  font-size: 14px;
                  color: #CCCCCC;
                  margin-bottom: 24px;
              }
              
              .verify-button {
                  display: inline-block;
                  background: linear-gradient(135deg, #6C2BD9 0%, #9D5CFF 100%);
                  color: #FFFFFF;
                  text-decoration: none;
                  padding: 14px 32px;
                  border-radius: 8px;
                  font-weight: 600;
                  font-size: 16px;
                  transition: all 0.3s ease;
                  border: none;
                  cursor: pointer;
              }
              
              .verify-button:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 8px 25px rgba(108, 43, 217, 0.3);
              }
              
              .link-alternative {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #888888;
              }
              
              .verification-link {
                  word-break: break-all;
                  color: #9D5CFF;
                  text-decoration: none;
              }
              
              .info-section {
                  background: #2A2A2A;
                  border-radius: 8px;
                  padding: 20px;
                  margin: 24px 0;
              }
              
              .info-title {
                  font-size: 14px;
                  font-weight: 600;
                  color: #9D5CFF;
                  margin-bottom: 12px;
              }
              
              .info-list {
                  list-style: none;
                  padding: 0;
              }
              
              .info-list li {
                  font-size: 13px;
                  color: #CCCCCC;
                  margin-bottom: 8px;
                  padding-left: 16px;
                  position: relative;
              }
              
              .info-list li:before {
                  content: "•";
                  color: #9D5CFF;
                  position: absolute;
                  left: 0;
              }
              
              .email-footer {
                  background: #2A2A2A;
                  padding: 30px;
                  text-align: center;
                  border-top: 1px solid #333333;
              }
              
              .footer-text {
                  font-size: 12px;
                  color: #888888;
                  margin-bottom: 8px;
              }
              
              .security-notice {
                  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                  color: #FFFFFF;
                  padding: 12px 16px;
                  border-radius: 8px;
                  font-size: 12px;
                  font-weight: 500;
                  margin: 20px 0;
              }
              
              .support-link {
                  color: #9D5CFF;
                  text-decoration: none;
                  font-weight: 500;
              }
              
              @media (max-width: 600px) {
                  .email-container {
                      margin: 10px;
                      border-radius: 12px;
                  }
                  
                  .email-header {
                      padding: 30px 20px;
                  }
                  
                  .email-content {
                      padding: 30px 20px;
                  }
                  
                  .welcome-title {
                      font-size: 24px;
                  }
                  
                  .verification-box {
                      padding: 20px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <!-- Header -->
              <div class="email-header">
                  <div class="logo">WiseVote</div>
                  <div class="logo-subtitle">Secure Digital Voting Platform</div>
              </div>
              
              <!-- Content -->
              <div class="email-content">
                  <h1 class="welcome-title">Welcome to WiseVote!</h1>
                  <p class="welcome-subtitle">
                      Thank you for joining our secure e-voting platform. Let's get your account verified.
                  </p>
                  
                  <!-- Verification Box -->
                  <div class="verification-box">
                      <h2 class="verification-title">Verify Your Email Address</h2>
                      <p class="verification-text">
                          Click the button below to verify your email address and activate your account.
                      </p>
                      <a href="${verificationLink}" class="verify-button">
                          Verify Email Address
                      </a>
                      <div class="link-alternative">
                          Or copy and paste this link in your browser:<br>
                          <a href="${verificationLink}" class="verification-link">${verificationLink}</a>
                      </div>
                  </div>
                  
                  <!-- Security Info -->
                  <div class="security-notice">
                      🔒 Secure Verification - This link expires in 24 hours for your protection
                  </div>
                  
                  <!-- Additional Information -->
                  <div class="info-section">
                      <h3 class="info-title">What's Next?</h3>
                      <ul class="info-list">
                          <li>Complete your voter profile after verification</li>
                          <li>Explore upcoming elections in your area</li>
                          <li>Access secure voting features</li>
                          <li>Receive real-time election updates</li>
                      </ul>
                  </div>
              </div>
              
              <!-- Footer -->
              <div class="email-footer">
                  <p class="footer-text">
                      This email was sent to ${email} as part of your WiseVote account registration.
                  </p>
                  <p class="footer-text">
                      If you didn't create an account with WiseVote, please ignore this email.
                  </p>
                  <p class="footer-text">
                      Need help? Contact our 
                      <a href="mailto:support@wisevote.com" class="support-link">support team</a>
                  </p>
                  <p class="footer-text">
                      © 2024 WiseVote. All rights reserved.<br>
                      Building the future of democratic participation.
                  </p>
              </div>
          </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to: ${email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

module.exports = sendVerificationEmail;
