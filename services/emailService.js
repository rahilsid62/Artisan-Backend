// Placeholder for sending emails (e.g., for password reset)
exports.sendEmail = async (to, subject, text) => {
    // Use nodemailer or similar here in production
    console.log(`Sending email to ${to}: ${subject}\n${text}`);
  };
  