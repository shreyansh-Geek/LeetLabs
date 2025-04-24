import Mailgen from "mailgen";

// Initialize Mailgen
const mailGenerator = new Mailgen({
  theme: 'salted', //
  product: {
    name: 'LeetLabs', 
    link: `${process.env.BASE_URL}/`,
  },
});

// Template for Registration Email
export const registrationMailTemplate = ({ name, verificationLink }) => {
  const email = {
    body: {
      name,
      intro: `Welcome to Your App, ${name}! We're excited to have you on board.`,
      action: {
        instructions: 'To get started, please verify your email by clicking below:',
        button: {
          color: '#22BC66', // Green
          text: 'Verify Your Email',
          link: verificationLink,
        },
      },
      outro: 'Need help? Just reply to this email, we are always happy to help.',
    },
  };

  return mailGenerator.generate(email); // generates HTML email
};


// Template for Password Reset Email
export const passwordResetMailTemplate = ({ name, resetLink }) => {
  const email = {
    body: {
      name,
      intro: `It seems like you requested a password reset.`,
      action: {
        instructions: 'Click the button below to reset your password. This link is valid for a limited time:',
        button: {
          color: '#DC4D2F', // Red
          text: 'Reset Your Password',
          link: resetLink,
        },
      },
      outro: 'If you did not request a password reset, please ignore this email or contact support if you have questions.',
    },
  };

  return mailGenerator.generate(email); // HTML content
};
