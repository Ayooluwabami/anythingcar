interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = async (options: EmailOptions) => {
  // Implement email sending logic here
  // You can use nodemailer or any other email service
  console.log('Sending email:', options);
};