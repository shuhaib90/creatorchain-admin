import { Resend } from 'resend';

// Initialize Resend with the provided API key
// In production, you should set this as an Environment Variable: RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY || 're_WwWNkFUF_DX3Chmj7uvgH54Pcrv25aQwN');

export default async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, payload } = req.body;

  if (!type || !payload) {
    return res.status(400).json({ error: 'Missing type or payload' });
  }

  try {
    let subject, html, to;

    // Default "from" email - Resend onboarding email
    // NOTE: For production, use a verified domain email like 'notifications@creatorchain.site'
    const fromEmail = 'CreatorChain <notifications@creatorchain.site>';

    if (type === 'hire_request') {
      to = payload.receiver_email;
      if (!to) return res.status(400).json({ error: 'Receiver email is required' });

      subject = `🚀 New Hire Request: ${payload.sender_name} wants to work with you!`;
      html = `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; border: 4px solid #000; padding: 30px; background: #fff; box-shadow: 10px 10px 0 #000;">
          <h1 style="font-size: 28px; font-weight: 900; margin-top: 0; color: #000; text-transform: uppercase; letter-spacing: -1px;">
            New Hire <span style="background: #00f5a0; padding: 0 5px;">Request</span>
          </h1>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Hi there! You've received a high-intent hire request through the CreatorChain platform.
          </p>
          <div style="background: #f0f0f0; padding: 20px; border: 2px solid #000; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>FROM:</strong> ${payload.sender_name}</p>
            <p style="margin: 5px 0;"><strong>EMAIL:</strong> ${payload.sender_email}</p>
            ${payload.telegram ? `<p style="margin: 5px 0;"><strong>TELEGRAM:</strong> ${payload.telegram}</p>` : ''}
            <p style="margin: 15px 0 5px 0; border-top: 1px dashed #ccc; padding-top: 10px;"><strong>MESSAGE:</strong></p>
            <p style="font-style: italic; color: #555;">"${payload.message}"</p>
          </div>
          <p style="font-size: 14px; color: #666;">
            We recommend replying directly to the sender's email to continue the conversation.
          </p>
          <div style="margin-top: 30px; border-top: 2px solid #000; padding-top: 20px; text-align: center;">
            <p style="font-weight: 800; font-size: 12px; text-transform: uppercase;">Sent via CreatorChain Network</p>
          </div>
        </div>
      `;
    } else if (type === 'new_opportunity') {
      to = payload.to; // Can be a string or array
      if (!to) return res.status(400).json({ error: 'Recipient email is required' });

      subject = `⚡ New Opportunity matching your skills: ${payload.project_name}`;
      html = `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; border: 4px solid #000; padding: 30px; background: #fff; box-shadow: 10px 10px 0 #000;">
          <h1 style="font-size: 28px; font-weight: 900; margin-top: 0; color: #000; text-transform: uppercase; letter-spacing: -1px;">
            New <span style="background: #00f5a0; padding: 0 5px;">Opportunity</span>
          </h1>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            A new project has been posted that matches your expertise!
          </p>
          <div style="background: #f0f0f0; padding: 20px; border: 2px solid #000; margin: 20px 0;">
            <p style="margin: 5px 0; font-size: 20px; font-weight: 900;">${payload.project_name}</p>
            <p style="margin: 10px 0; color: #555;">${payload.description}</p>
            <p style="margin: 10px 0;"><strong>BUDGET:</strong> ${payload.budget}</p>
          </div>
          <a href="https://creatorchain.site/" style="display: inline-block; background: #000; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; border: 2px solid #000;">
            VIEW PROJECT DETAILS
          </a>
          <div style="margin-top: 30px; border-top: 2px solid #000; padding-top: 20px; text-align: center;">
            <p style="font-weight: 800; font-size: 12px; text-transform: uppercase;">CreatorChain Notification Engine</p>
          </div>
        </div>
      `;
    } else if (type === 'opportunity_approved') {
      to = payload.to;
      if (!to) return res.status(400).json({ error: 'Recipient email is required' });

      subject = `✅ Your Opportunity is LIVE on CreatorChain: ${payload.project_name}`;
      html = `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; border: 4px solid #000; padding: 30px; background: #fff; box-shadow: 10px 10px 0 #000;">
          <h1 style="font-size: 28px; font-weight: 900; margin-top: 0; color: #000; text-transform: uppercase; letter-spacing: -1px;">
            Submission <span style="background: #00f5a0; padding: 0 5px;">Approved</span>
          </h1>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Great news! The opportunity you submitted for <strong>${payload.project_name}</strong> has been reviewed and approved by the admin team.
          </p>
          <div style="background: #f0f0f0; padding: 20px; border: 2px solid #000; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>PROJECT:</strong> ${payload.project_name}</p>
            <p style="margin: 5px 0;"><strong>TITLE:</strong> ${payload.title}</p>
            <p style="margin: 5px 0;"><strong>STATUS:</strong> LIVE 🟢</p>
          </div>
          <p style="font-size: 14px; color: #666;">
            We've just broadcasted this opportunity to our entire network of builders and community leads. You can expect applicants to reach out via your specified contact method shortly!
          </p>
          <a href="https://creatorchain.site/" style="display: inline-block; background: #000; color: #fff; padding: 15px 30px; margin-top: 10px; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; border: 2px solid #000;">
            VIEW IT LIVE
          </a>
          <div style="margin-top: 30px; border-top: 2px solid #000; padding-top: 20px; text-align: center;">
            <p style="font-weight: 800; font-size: 12px; text-transform: uppercase;">CreatorChain Admin Team</p>
          </div>
        </div>
      `;
    } else {
      return res.status(400).json({ error: 'Invalid notification type' });
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: to,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Resend Error:', error);
      return res.status(400).json({ error });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Email API Error:', error);
    res.status(500).json({ error: error.message });
  }
};
