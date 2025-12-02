import { withCors } from './_lib/cors.js';
import { created, badRequest, methodNotAllowed, ok } from './_lib/json.js';

// FREE Email-to-SMS Gateway Function
// Most mobile carriers support sending SMS via email
async function sendEmailToSMS(phoneNumber, message) {
  // Remove + and spaces from phone number
  let cleanNumber = phoneNumber.replace(/[\s+]/g, '');
  
  // If number starts with country code, remove it for email format
  // +254111529709 -> 254111529709 -> 111529709@sms.safaricom.co.ke
  if (cleanNumber.startsWith('254')) {
    cleanNumber = cleanNumber.substring(3); // Remove country code
  } else if (cleanNumber.startsWith('0')) {
    cleanNumber = cleanNumber.substring(1); // Remove leading 0
  }
  
  // Kenyan carrier email-to-SMS gateways
  // Format: [number without country code]@[carrier-gateway]
  // Try Safaricom first (most common in Kenya)
  const smsEmail = `${cleanNumber}@sms.safaricom.co.ke`;
  
  try {
    // If SMTP is configured, use it
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: smsEmail,
        subject: '', // SMS doesn't need subject
        text: message
      });

      console.log(`Email-to-SMS sent to ${smsEmail}`);
      return true;
    }
    
    // If no SMTP, return false to try other methods
    return false;
  } catch (error) {
    console.error('Email-to-SMS failed:', error);
    return false;
  }
}

export default withCors(async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res);
  
  const { name, email, subject, service, message, date, time } = req.body || {};
  
  if (!name || !email || !subject) {
    return badRequest(res, 'Missing required fields: name, email, subject');
  }

  // Your phone number (Kenya format)
  const YOUR_PHONE_NUMBER = process.env.YOUR_PHONE_NUMBER || '+254111529709';
  
  // Format the SMS message
  const serviceName = service || 'Not specified';
  const dateTimeStr = date && time ? `${date} at ${time}` : 'Not specified';
  
  const smsBody = `New Contact Form Message\n\n` +
    `From: ${name}\n` +
    `Email: ${email}\n` +
    `Subject: ${subject}\n` +
    `Service: ${serviceName}\n` +
    `Date/Time: ${dateTimeStr}\n` +
    `Message: ${message || 'No additional message'}`;

  try {
    // FREE OPTION 1: Email-to-SMS Gateway (100% Free!)
    // Most carriers support sending SMS via email
    if (process.env.USE_EMAIL_TO_SMS === 'true' || (!process.env.TWILIO_ACCOUNT_SID && !process.env.AWS_ACCESS_KEY_ID)) {
      try {
        const emailSent = await sendEmailToSMS(YOUR_PHONE_NUMBER, smsBody);
        if (emailSent) {
          return ok(res, { 
            success: true, 
            method: 'email-to-sms',
            note: 'SMS sent via free email-to-SMS gateway'
          });
        }
      } catch (emailError) {
        console.error('Email-to-SMS error:', emailError);
        // Fall through to paid options
      }
    }

    // PAID OPTION 1: Try Twilio (if configured)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      try {
        const twilioModule = await import('twilio');
        const twilio = twilioModule.default || twilioModule;
        const client = twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );

        const result = await client.messages.create({
          body: smsBody,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: YOUR_PHONE_NUMBER
        });

        return ok(res, { 
          success: true, 
          messageId: result.sid,
          method: 'twilio'
        });
      } catch (twilioError) {
        console.error('Twilio import/execution error:', twilioError);
        // Fall through to next method
      }
    }
    
    // PAID OPTION 2: Try AWS SNS if configured
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_REGION) {
      try {
        const AWS = await import('aws-sdk');
        const sns = new AWS.default.SNS({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION
        });

        const params = {
          Message: smsBody,
          PhoneNumber: YOUR_PHONE_NUMBER
        };

        const result = await sns.publish(params).promise();
        
        return ok(res, { 
          success: true, 
          messageId: result.MessageId,
          method: 'aws-sns'
        });
      } catch (awsError) {
        console.error('AWS SNS error:', awsError);
        // Fall through
      }
    }

    // If no SMS service configured, return success but log a warning
    console.warn('SMS service not configured. Using free email-to-SMS or configure TWILIO_* or AWS_* environment variables.');
    return ok(res, { 
      success: false, 
      message: 'SMS service not configured',
      note: 'Message would be sent via SMS if service was configured. Email will still work.'
    });

  } catch (error) {
    console.error('SMS sending error:', error);
    // Don't fail the request - email will still work
    return ok(res, { 
      success: false, 
      error: error.message,
      note: 'SMS failed but email will still work'
    });
  }
});

