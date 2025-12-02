/**
 * Interactive FREE SMS Setup Script
 * This script helps you configure FREE Email-to-SMS step by step
 */

import readline from 'readline';
import { writeFileSync, existsSync, readFileSync } from 'fs';
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

async function setupFreeSMS() {
  console.log('\n📱 FREE SMS Setup for Sufuria Arts Photography\n');
  console.log('💰 This setup is 100% FREE - No paid services needed!\n');
  console.log('We\'ll use Email-to-SMS gateway (Gmail, Outlook, etc.)\n');

  console.log('📋 Step 1: Choose Your Email Provider\n');
  console.log('1. Gmail (Recommended - Easiest)');
  console.log('2. Outlook/Hotmail');
  console.log('3. Yahoo');
  console.log('4. Other (Custom SMTP)\n');

  const emailChoice = await question('Choose option (1-4): ');

  let smtpHost, smtpPort, smtpSecure;
  let providerName = '';

  switch (emailChoice) {
    case '1':
      providerName = 'Gmail';
      smtpHost = 'smtp.gmail.com';
      smtpPort = '587';
      smtpSecure = 'false';
      break;
    case '2':
      providerName = 'Outlook';
      smtpHost = 'smtp-mail.outlook.com';
      smtpPort = '587';
      smtpSecure = 'false';
      break;
    case '3':
      providerName = 'Yahoo';
      smtpHost = 'smtp.mail.yahoo.com';
      smtpPort = '587';
      smtpSecure = 'false';
      break;
    case '4':
      smtpHost = await question('Enter SMTP host (e.g., smtp.example.com): ');
      smtpPort = await question('Enter SMTP port (usually 587 or 465): ');
      const secureChoice = await question('Use secure connection? (yes/no, usually no for 587): ');
      smtpSecure = secureChoice.toLowerCase() === 'yes' ? 'true' : 'false';
      providerName = 'Custom';
      break;
    default:
      console.log('Invalid choice. Using Gmail as default.');
      providerName = 'Gmail';
      smtpHost = 'smtp.gmail.com';
      smtpPort = '587';
      smtpSecure = 'false';
  }

  console.log(`\n✓ Using ${providerName} SMTP settings\n`);

  if (emailChoice === '1') {
    console.log('📝 Step 2: Get Gmail App Password\n');
    console.log('For Gmail, you need to create an App Password:');
    console.log('1. Go to: https://myaccount.google.com/security');
    console.log('2. Enable 2-Step Verification (if not already enabled)');
    console.log('3. Go to "App passwords" (search for it)');
    console.log('4. Select "Mail" and "Other (Custom name)"');
    console.log('5. Enter "SMS Gateway" as the name');
    console.log('6. Click "Generate"');
    console.log('7. Copy the 16-character password (no spaces)\n');
    console.log('⚠️  Important: Use the App Password, NOT your regular Gmail password!\n');
  } else if (emailChoice === '2') {
    console.log('📝 Step 2: Outlook Password\n');
    console.log('For Outlook, you can usually use your regular password.');
    console.log('If it doesn\'t work, you may need to enable "Less secure app access"\n');
  } else {
    console.log('📝 Step 2: Email Credentials\n');
    console.log('Enter your email credentials below.\n');
  }

  const email = await question('Enter your email address: ');
  const password = await question('Enter your password (or App Password for Gmail): ');
  const phoneNumber = await question('Enter your phone number (e.g., +254111529709): ');

  console.log('\n📝 Creating .env file...\n');

  // Read existing .env if it exists
  let envContent = '';
  const envPath = join(process.cwd(), '.env');
  
  if (existsSync(envPath)) {
    envContent = readFileSync(envPath, 'utf8');
    
    // Update existing values or add new ones
    const lines = envContent.split('\n');
    const newLines = [];
    let foundSms = false;
    let foundSmtp = false;
    
    for (const line of lines) {
      if (line.startsWith('USE_EMAIL_TO_SMS=')) {
        newLines.push('USE_EMAIL_TO_SMS=true');
        foundSms = true;
      } else if (line.startsWith('SMTP_HOST=')) {
        newLines.push(`SMTP_HOST=${smtpHost}`);
        foundSmtp = true;
      } else if (line.startsWith('SMTP_PORT=')) {
        newLines.push(`SMTP_PORT=${smtpPort}`);
      } else if (line.startsWith('SMTP_SECURE=')) {
        newLines.push(`SMTP_SECURE=${smtpSecure}`);
      } else if (line.startsWith('SMTP_USER=')) {
        newLines.push(`SMTP_USER=${email}`);
      } else if (line.startsWith('SMTP_PASS=')) {
        newLines.push(`SMTP_PASS=${password}`);
      } else if (line.startsWith('YOUR_PHONE_NUMBER=')) {
        newLines.push(`YOUR_PHONE_NUMBER=${phoneNumber}`);
      } else {
        newLines.push(line);
      }
    }
    
    if (!foundSms) {
      newLines.push('');
      newLines.push('# FREE SMS - Email-to-SMS Gateway (100% Free!)');
      newLines.push('USE_EMAIL_TO_SMS=true');
      newLines.push(`SMTP_HOST=${smtpHost}`);
      newLines.push(`SMTP_PORT=${smtpPort}`);
      newLines.push(`SMTP_SECURE=${smtpSecure}`);
      newLines.push(`SMTP_USER=${email}`);
      newLines.push(`SMTP_PASS=${password}`);
      newLines.push(`YOUR_PHONE_NUMBER=${phoneNumber}`);
    }
    
    envContent = newLines.join('\n');
  } else {
    // Create new .env file
    envContent = `# FREE SMS - Email-to-SMS Gateway (100% Free!)
USE_EMAIL_TO_SMS=true
SMTP_HOST=${smtpHost}
SMTP_PORT=${smtpPort}
SMTP_SECURE=${smtpSecure}
SMTP_USER=${email}
SMTP_PASS=${password}
YOUR_PHONE_NUMBER=${phoneNumber}
`;
  }

  try {
    writeFileSync(envPath, envContent);
    console.log('✅ Configuration saved to .env file\n');
    console.log('📋 Summary:');
    console.log(`   Email Provider: ${providerName}`);
    console.log(`   Email: ${email}`);
    console.log(`   Phone: ${phoneNumber}`);
    console.log(`   Method: FREE Email-to-SMS Gateway\n`);
  } catch (error) {
    console.error('❌ Error saving .env file:', error.message);
    console.log('\nPlease create .env file manually with:');
    console.log('USE_EMAIL_TO_SMS=true');
    console.log(`SMTP_HOST=${smtpHost}`);
    console.log(`SMTP_PORT=${smtpPort}`);
    console.log(`SMTP_SECURE=${smtpSecure}`);
    console.log(`SMTP_USER=${email}`);
    console.log(`SMTP_PASS=${password}`);
    console.log(`YOUR_PHONE_NUMBER=${phoneNumber}`);
    rl.close();
    return;
  }

  const testNow = await question('Would you like to test SMS now? (yes/no): ');
  
  if (testNow.toLowerCase() === 'yes' || testNow.toLowerCase() === 'y') {
    console.log('\n🧪 Running SMS test...\n');
    rl.close();
    
    // Note: test-free-sms.js runs its own process
    console.log('Run: npm run test-free-sms\n');
    process.exit(0);
  } else {
    console.log('\n✅ Setup complete!');
    console.log('\nTo test SMS, run: npm run test-free-sms');
    console.log('Or: node test-free-sms.js\n');
    console.log('💰 Cost: $0.00 - Completely FREE! 🎉\n');
    rl.close();
  }
}

setupFreeSMS().catch((error) => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});

