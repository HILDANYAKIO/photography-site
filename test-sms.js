/**
 * Test script to verify Twilio SMS configuration
 * Run: node test-sms.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const YOUR_PHONE_NUMBER = process.env.YOUR_PHONE_NUMBER || '+254111529709';
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

async function testSMS() {
  console.log('🧪 Testing SMS Configuration...\n');

  // Check if Twilio is configured
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error('❌ Twilio not configured!');
    console.log('\nPlease set these environment variables in your .env file:');
    console.log('  TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    console.log('  TWILIO_AUTH_TOKEN=your_auth_token_here');
    console.log('  TWILIO_PHONE_NUMBER=+1234567890');
    console.log('  YOUR_PHONE_NUMBER=+254111529709');
    console.log('\nGet your credentials from: https://console.twilio.com/');
    process.exit(1);
  }

  console.log('✓ Twilio credentials found');
  console.log(`  Account SID: ${TWILIO_ACCOUNT_SID.substring(0, 10)}...`);
  console.log(`  From Number: ${TWILIO_PHONE_NUMBER}`);
  console.log(`  To Number: ${YOUR_PHONE_NUMBER}\n`);

  try {
    // Import Twilio
    const twilioModule = await import('twilio');
    const twilio = twilioModule.default || twilioModule;
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    console.log('📤 Sending test SMS...\n');

    const testMessage = `Test SMS from Sufuria Arts Photography

This is a test message to verify your SMS configuration is working correctly.

If you received this, your SMS service is properly configured! ✅`;

    const result = await client.messages.create({
      body: testMessage,
      from: TWILIO_PHONE_NUMBER,
      to: YOUR_PHONE_NUMBER
    });

    console.log('✅ SMS sent successfully!');
    console.log(`   Message SID: ${result.sid}`);
    console.log(`   Status: ${result.status}`);
    console.log(`\n📱 Check your phone (${YOUR_PHONE_NUMBER}) for the test message.\n`);

  } catch (error) {
    console.error('❌ Failed to send SMS:', error.message);
    
    if (error.code === 21211) {
      console.error('\n⚠️  Invalid phone number format.');
      console.error('   Make sure phone numbers include country code (e.g., +254111529709)');
    } else if (error.code === 21608) {
      console.error('\n⚠️  Twilio phone number not verified.');
      console.error('   Verify your phone number in Twilio Console first.');
    } else if (error.code === 20003) {
      console.error('\n⚠️  Invalid Twilio credentials.');
      console.error('   Check your TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN');
    }
    
    process.exit(1);
  }
}

testSMS().catch(console.error);

