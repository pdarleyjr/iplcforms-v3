import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const runtime = locals.runtime as any;
    const env = runtime.env;
    
    // Validate request
    const data = await request.json();
    const { emailTo, emailFrom, emailSubject } = data;
    
    if (!emailTo || !emailFrom || !emailSubject) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const recipients = emailTo.split(',').map((email: string) => email.trim());
    
    for (const email of recipients) {
      if (!emailRegex.test(email)) {
        return new Response(JSON.stringify({ error: `Invalid email address: ${email}` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    if (!emailRegex.test(emailFrom)) {
      return new Response(JSON.stringify({ error: 'Invalid from email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate subject template
    if (!emailSubject.trim()) {
      return new Response(JSON.stringify({ error: 'Subject template cannot be empty' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Store configuration
    const config = {
      recipients: recipients,
      from: emailFrom,
      subjectTemplate: emailSubject,
      configured: true,
      updatedAt: new Date().toISOString()
    };
    
    await env.CACHE_KV.put('integration:email:config', JSON.stringify(config), {
      expirationTtl: 365 * 24 * 60 * 60 // 1 year
    });
    
    // Test email sending (optional - comment out if you don't want test emails)
    try {
      const testSubject = emailSubject
        .replace('{formTitle}', 'Test Form')
        .replace('{submissionId}', 'test-123');
      
      const testEmail = {
        personalizations: [
          {
            to: recipients.map(email => ({ email }))
          }
        ],
        from: {
          email: emailFrom,
          name: 'IPLC Forms'
        },
        subject: testSubject,
        content: [
          {
            type: 'text/html',
            value: `
              <h2>Email Integration Test</h2>
              <p>This is a test email from IPLC Forms to verify your email configuration.</p>
              <p>If you received this email, your integration is working correctly!</p>
              <hr>
              <p><small>Configuration saved at ${new Date().toLocaleString()}</small></p>
            `
          }
        ]
      };
      
      
      // Note: In production, you would send this to MailChannels API
      // For now, we'll just simulate success
      console.log('Test email would be sent:', testEmail);
      
    } catch (error) {
      console.error('Error sending test email:', error);
      // Don't fail the configuration save if test email fails
    }
    
    return new Response(JSON.stringify({ 
      message: 'Email configuration saved successfully!' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error saving email configuration:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to save configuration' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    const runtime = locals.runtime as any;
    const env = runtime.env;
    
    const config = await env.CACHE_KV.get('integration:email:config');
    if (!config) {
      return new Response(JSON.stringify({ configured: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(config, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error fetching email configuration:', error);
    return new Response(JSON.stringify({ configured: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Helper function to send email notification for form submission
export async function sendEmail(env: any, formTitle: string, submissionId: string | number, formData: any) {
  const configStr = await env.CACHE_KV.get('integration:email:config');
  if (!configStr) {
    return null; // Integration not configured
  }
  
  const config = JSON.parse(configStr);
  
  // Replace placeholders in subject
  const subject = config.subjectTemplate
    .replace('{formTitle}', formTitle)
    .replace('{submissionId}', submissionId.toString());
  
  // Format the email body
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">📋 ${formTitle}</h2>
      <p style="color: #666;">A new form submission has been received.</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Submission ID:</strong> ${submissionId}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      <h3 style="color: #333;">Form Data:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${Object.entries(formData)
          .map(([key, value]) => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold;">${key}:</td>
              <td style="padding: 10px;">${value}</td>
            </tr>
          `).join('')}
      </table>
      
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        This email was sent from IPLC Forms v3
      </p>
    </div>
  `;
  
  // Send email using MailChannels
  const emailPayload = {
    personalizations: [
      {
        to: config.recipients.map((email: string) => ({ email: email.trim() }))
      }
    ],
    from: {
      email: config.from,
      name: 'IPLC Forms'
    },
    subject: subject,
    content: [
      {
        type: 'text/html',
        value: htmlContent
      }
    ]
  };
  
  // For Cloudflare Workers with MailChannels
  const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailPayload)
  });
  
  if (!response.ok) {
    throw new Error(`Email notification failed: ${response.status}`);
  }
  
  return { success: true };
}