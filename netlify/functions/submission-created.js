const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    // For submission-created, this check might not be relevant as Netlify invokes it.
    // However, keeping it or adapting it might be useful if you trigger it manually for tests.
    // For now, we'll assume Netlify's invocation.
  }

  const { MAILGUN_DOMAIN, FORM_RECIPIENT_EMAIL } = process.env;

  if (!MAILGUN_DOMAIN || !FORM_RECIPIENT_EMAIL || !process.env.MAILGUN_API_KEY) {
    console.error('Missing Mailgun environment variables');
    return { statusCode: 500, body: 'Server configuration error.' };
  }

  try {
    // Parse the form data from the event payload for submission-created functions
    // The actual submitted data is in event.payload.data or event.payload.human_fields
    const submission = event.payload.data; // or event.payload.human_fields for spam-filtered data
    
    const name = submission.name || 'N/A';
    const email = submission.email || 'N/A';
    const phone = submission.phone || 'N/A';
    const message = submission.message || 'N/A';
    // The 'bot-field' (honeypot) is handled by Netlify before this function is triggered if using __forms.html.
    // So, an explicit check here for bot-field might be redundant but doesn't hurt.
    // const honeypot = submission['bot-field']; 

    // Ensure required fields are present (adjust based on your actual form on __forms.html)
    if (!submission.name || !submission.message || !submission.email) {
         return { statusCode: 400, body: 'Missing required form fields in submission payload.' };
    }

    const mailData = {
      from: `Contact Form <mailgun@${MAILGUN_DOMAIN}>`,
      to: [FORM_RECIPIENT_EMAIL],
      subject: `New Contact Form Submission from ${name}`,
      text: `You received a new message from your website contact form:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage:\n${message}\n      `,
      html: `<p>You received a new message from your website contact form:</p>\n             <ul>\n               <li><strong>Name:</strong> ${name}</li>\n               <li><strong>Email:</strong> ${email}</li>\n               <li><strong>Phone:</strong> ${phone}</li>\n             </ul>\n             <p><strong>Message:</strong></p>\n             <p>${message.replace(/\n/g, '<br>')}</p>`,
       'h:Reply-To': email,
    };

    await mg.messages.create(MAILGUN_DOMAIN, mailData);

    // For submission-created, the return value isn't typically sent back to the client that filled the form.
    // It's more for Netlify's logging.
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Mailgun email sent successfully via submission-created function.' }),
    };
  } catch (error) {
    console.error('Error sending email via submission-created:', error);
    if (error.response && error.response.body) {
      console.error('Mailgun error response:', error.response.body);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send message via Mailgun in submission-created.' }),
    };
  }
}; 