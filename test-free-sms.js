/**
 * Test FREE Email-to-SMS Gateway
 * Run: node test-free-sms.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const YOUR_PHONE_NUMBER = process.env.YOUR_PHONE_NUMBER || '+254111529709';
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

async function testFreeSMS() {
  console.log('🧪 Testing FREE Email-to-SMS Gateway...\n');

  // Check if SMTP is configured
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('❌ SMTP not configured!');
    console.log('\nTo use FREE SMS, add these to your .env file:');
    console.log('  USE_EMAIL_TO_SMS=true');
    console.log('  SMTP_HOST=smtp.gmail.com');
    console.log('  SMTP_PORT=587');
    console.log('  SMTP_USER=your-email@gmail.com');
    console.log('  SMTP_PASS=your-app-password');
    console.log('  YOUR_PHONE_NUMBER=+254111529709');
    console.log('\n📖 See FREE_SMS_SETUP.md for detailed instructions');
    process.exit(1);
  }

  console.log('✓ SMTP credentials found');
  console.log(`  Host: ${SMTP_HOST}`);
  console.log(`  User: ${SMTP_USER}`);
  console.log(`  Phone: ${YOUR_PHONE_NUMBER}\n`);

  try {
    // Import nodemailer
    const nodemailer = await import('nodemailer');
    
    // Determine carrier and create email address
    let cleanNumber = YOUR_PHONE_NUMBER.replace(/[\s+]/g, '');
    // Remove country code if present
    if (cleanNumber.startsWith('254')) {
      cleanNumber = cleanNumber.substring(3);
    } else if (cleanNumber.startsWith('0')) {
      cleanNumber = cleanNumber.substring(1);
    }
    const smsEmail = `${cleanNumber}@sms.safaricom.co.ke`; // Safaricom (most common in Kenya)
    
    console.log(`📤 Sending SMS via email to: ${smsEmail}\n`);

    // Create transporter
    const transporter = nodemailer.default.createTransport({
      host: SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    // Test message
    const testMessage = `Test SMS from Sufuria Arts Photography

This is a test message to verify your FREE SMS configuration is working correctly.

If you received this, your free Email-to-SMS setup is working! ✅`;

    // Send email
    const info = await transporter.sendMail({
      from: SMTP_USER,
      to: smsEmail,
      subject: '', // SMS doesn't need subject
      text: testMessage
    });

    console.log('✅ SMS sent successfully via Email-to-SMS Gateway!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Method: FREE Email-to-SMS`);
    console.log(`\n📱 Check your phone (${YOUR_PHONE_NUMBER}) for the test message.`);
    console.log('   (May take 1-2 minutes to arrive)\n');
    console.log('💰 Cost: $0.00 - Completely FREE! 🎉\n');

  } catch (error) {
    console.error('❌ Failed to send SMS:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n⚠️  Authentication failed.');
      console.error('   - Check your email and password');
      console.error('   - For Gmail: Use an App Password, not your regular password');
      console.error('   - Enable 2-Step Verification first');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n⚠️  Connection failed.');
      console.error('   - Check your SMTP_HOST and SMTP_PORT');
      console.error('   - Verify firewall isn\'t blocking the connection');
    } else {
      console.error('\n⚠️  Error details:', error);
    }
    
    process.exit(1);
  }
}

testFreeSMS().catch(console.error);

