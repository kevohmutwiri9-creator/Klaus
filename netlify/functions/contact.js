const https = require('https');

function sendResendEmail(payload) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.TO_EMAIL || 'kevohmutwiri35@gmail.com';

  if (!apiKey) {
    return Promise.resolve({ ok: true, skipped: true });
  }

  const body = JSON.stringify({
    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
    to: [toEmail],
    subject: payload.subject || 'Portfolio enquiry',
    html: `
      <h2>New portfolio enquiry</h2>
      <p><strong>Name:</strong> ${payload.name || 'N/A'}</p>
      <p><strong>Email:</strong> ${payload.email || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <p>${(payload.message || '').replace(/\n/g, '<br>')}</p>
    `
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ ok: true, response: responseBody });
        } else {
          reject(new Error(`Resend request failed with ${res.statusCode}: ${responseBody}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
  }

  let payload = {};

  try {
    payload = JSON.parse(event.body || '{}');
  } catch (error) {
    try {
      payload = Object.fromEntries(new URLSearchParams(event.body || ''));
    } catch (parseError) {
      payload = {};
    }
  }

  const formType = payload.formType || 'contact';
  const name = payload.name || '';
  const email = payload.email || '';
  const subject = payload.subject || '';
  const message = payload.message || '';

  try {
    if (formType === 'newsletter') {
      await sendResendEmail({
        name,
        email,
        subject: `Newsletter signup: ${subject || 'Portfolio updates'}`,
        message: `Newsletter signup received for ${email}`
      });
    } else {
      await sendResendEmail({ name, email, subject, message });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: formType === 'newsletter'
          ? 'Thanks for subscribing. I will keep you posted.'
          : 'Thanks for reaching out. I will get back to you soon.'
      })
    };
  } catch (error) {
    console.error('Contact form submission failed:', error);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: formType === 'newsletter'
          ? 'Thanks for subscribing. I will keep you posted.'
          : 'Thanks for reaching out. I will get back to you soon.'
      })
    };
  }
};
