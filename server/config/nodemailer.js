import axios from 'axios';

// Test the API connection
console.log('🔧 Brevo API Configuration:');
console.log('API Key:', process.env.BREVO_API_KEY ? '✅ Set' : '❌ Not set');

// Create a function to send emails using Brevo API
export const sendEmailWithBrevo = async (to, subject, textContent, htmlContent = null) => {
  try {
    const emailData = {
      sender: { 
        name: "MERN Auth App", 
        email: process.env.SENDER_EMAIL 
      },
      to: [{ email: to }],
      subject: subject,
      textContent: textContent
    };

    if (htmlContent) {
      emailData.htmlContent = htmlContent;
    }

    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      emailData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Api-Key': process.env.BREVO_API_KEY
        }
      }
    );

    console.log('✅ Email sent successfully via Brevo API');
    console.log('📧 Message ID:', response.data.messageId);
    return { success: true, messageId: response.data.messageId };
  } catch (error) {
    console.log('❌ Brevo API Error:', error.response?.data || error.message);
    throw new Error(`Email sending failed: ${error.response?.data?.message || error.message}`);
  }
};

export default { sendEmailWithBrevo };