const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { MAILGUN_DOMAIN, FORM_RECIPIENT_EMAIL } = process.env;

  if (!MAILGUN_DOMAIN || !FORM_RECIPIENT_EMAIL || !process.env.MAILGUN_API_KEY) {
    console.error('Missing Mailgun environment variables');
    return { statusCode: 500, body: 'Server configuration error.' };
  }

  try {
    // Parse the form data from the request body
    const params = new URLSearchParams(event.body);
    const name = params.get('name') || 'N/A';
    const email = params.get('email') || 'N/A';
    const phone = params.get('phone') || 'N/A';
    const message = params.get('message') || 'N/A';
    const honeypot = params.get('bot-field'); // Basic honeypot check

    // Basic spam check (honeypot)
    if (honeypot) {
      console.log('Honeypot field filled, likely spam.');
      return { statusCode: 400, body: 'Spam detected.' };
    }
    
    // Ensure required fields are present
    if (!params.get('name') || !params.get('message') || !params.get('email')) {
         return { statusCode: 400, body: 'Missing required form fields.' };
    }


    const mailData = {
      from: `Contact Form <mailgun@${MAILGUN_DOMAIN}>`, // Use mailgun@your-domain for sender
      to: [FORM_RECIPIENT_EMAIL],
      subject: `New Contact Form Submission from ${name}`,
      text: `You received a new message from your website contact form:

Name: ${name}
Email: ${email}
Phone: ${phone}
Message:
${message}
      `,
      html: `<p>You received a new message from your website contact form:</p>
             <ul>
               <li><strong>Name:</strong> ${name}</li>
               <li><strong>Email:</strong> ${email}</li>
               <li><strong>Phone:</strong> ${phone}</li>
             </ul>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, '<br>')}</p>`, // Basic newline to <br> conversion for HTML email
       // Set a reply-to header for convenience
       'h:Reply-To': email,
    };

    await mg.messages.create(MAILGUN_DOMAIN, mailData);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form submitted successfully!' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    // Check if error response from Mailgun exists and log it
    if (error.response && error.response.body) {
      console.error('Mailgun error response:', error.response.body);
    }
    return {
      statusCode: 500,
      // Provide a generic error message to the client
      body: JSON.stringify({ error: 'Failed to send message. Please try again later.' }),
    };
  }
}; 