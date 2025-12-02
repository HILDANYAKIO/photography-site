/**
 * Interactive SMS Setup Script
 * This script helps you configure Twilio SMS step by step
 */

import readline from 'readline';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupSMS() {
  console.log('\n📱 Twilio SMS Setup for Sufuria Arts Photography\n');
  console.log('This script will help you configure SMS notifications.\n');
  console.log('If you don\'t have a Twilio account yet:');
  console.log('  1. Go to https://www.twilio.com/try-twilio');
  console.log('  2. Sign up for a free account (includes $15.50 credit)');
  console.log('  3. Verify your email and phone number\n');

  const hasAccount = await question('Do you already have a Twilio account? (yes/no): ');
  
  if (hasAccount.toLowerCase() !== 'yes' && hasAccount.toLowerCase() !== 'y') {
    console.log('\n📝 Please sign up at https://www.twilio.com/try-twilio first.');
    console.log('   After signing up, come back and run this script again.\n');
    rl.close();
    return;
  }

  console.log('\n📋 You\'ll need these from your Twilio Console:');
  console.log('   - Account SID (starts with AC...)');
  console.log('   - Auth Token');
  console.log('   - A Twilio phone number\n');
  console.log('   Find them at: https://console.twilio.com/\n');

  const accountSid = await question('Enter your Twilio Account SID: ');
  const authToken = await question('Enter your Twilio Auth Token: ');
  const twilioPhone = await question('Enter your Twilio Phone Number (e.g., +1234567890): ');
  const yourPhone = await question('Enter YOUR phone number where SMS should be sent (e.g., +254111529709): ');

  // Validate phone numbers
  if (!accountSid.startsWith('AC')) {
    console.log('\n⚠️  Warning: Account SID should start with "AC"');
  }

  if (!twilioPhone.startsWith('+') || !yourPhone.startsWith('+')) {
    console.log('\n⚠️  Warning: Phone numbers should include country code (e.g., +254...)');
  }

  console.log('\n📝 Creating .env file...\n');

  // Read existing .env if it exists
  let envContent = '';
  const envPath = join(process.cwd(), '.env');
  
  if (existsSync(envPath)) {
    const fs = await import('fs');
    envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update existing values or add new ones
    const lines = envContent.split('\n');
    const newLines = [];
    let foundSms = false;
    
    for (const line of lines) {
      if (line.startsWith('TWILIO_ACCOUNT_SID=')) {
        newLines.push(`TWILIO_ACCOUNT_SID=${accountSid}`);
        foundSms = true;
      } else if (line.startsWith('TWILIO_AUTH_TOKEN=')) {
        newLines.push(`TWILIO_AUTH_TOKEN=${authToken}`);
      } else if (line.startsWith('TWILIO_PHONE_NUMBER=')) {
        newLines.push(`TWILIO_PHONE_NUMBER=${twilioPhone}`);
      } else if (line.startsWith('YOUR_PHONE_NUMBER=')) {
        newLines.push(`YOUR_PHONE_NUMBER=${yourPhone}`);
      } else {
        newLines.push(line);
      }
    }
    
    if (!foundSms) {
      newLines.push('');
      newLines.push('# SMS - Twilio Configuration');
      newLines.push(`TWILIO_ACCOUNT_SID=${accountSid}`);
      newLines.push(`TWILIO_AUTH_TOKEN=${authToken}`);
      newLines.push(`TWILIO_PHONE_NUMBER=${twilioPhone}`);
      newLines.push(`YOUR_PHONE_NUMBER=${yourPhone}`);
    }
    
    envContent = newLines.join('\n');
  } else {
    // Create new .env file
    envContent = `# SMS - Twilio Configuration
TWILIO_ACCOUNT_SID=${accountSid}
TWILIO_AUTH_TOKEN=${authToken}
TWILIO_PHONE_NUMBER=${twilioPhone}
YOUR_PHONE_NUMBER=${yourPhone}
`;
  }

  writeFileSync(envPath, envContent);
  console.log('✅ Configuration saved to .env file\n');

  const testNow = await question('Would you like to test SMS now? (yes/no): ');
  
  if (testNow.toLowerCase() === 'yes' || testNow.toLowerCase() === 'y') {
    console.log('\n🧪 Running SMS test...\n');
    rl.close();
    
    // Import and run test
    const { default: testSMS } = await import('./test-sms.js');
    // Note: test-sms.js runs its own process, so we just exit
    process.exit(0);
  } else {
    console.log('\n✅ Setup complete!');
    console.log('\nTo test SMS, run: npm run test-sms');
    console.log('Or: node test-sms.js\n');
    rl.close();
  }
}

setupSMS().catch((error) => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});

