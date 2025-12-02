# Quick SMS Setup Guide

## Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

If you get a PowerShell execution policy error on Windows, run this first:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try `npm install` again.

## Step 2: Get Twilio Credentials

1. **Sign up for Twilio** (if you don't have an account):
   - Go to: https://www.twilio.com/try-twilio
   - Create a free account (includes $15.50 credit for testing)
   - Verify your email and phone number

2. **Get your credentials from Twilio Console**:
   - Go to: https://console.twilio.com/
   - Find your **Account SID** (starts with `AC...`)
   - Find your **Auth Token** (click to reveal)
   - Get a **Phone Number** (or buy one if you don't have one)

## Step 3: Configure SMS

### Option A: Interactive Setup (Easiest)

Run the interactive setup script:

```bash
npm run setup-sms
```

This will guide you through entering your Twilio credentials step by step.

### Option B: Manual Setup

1. Create a `.env` file in the project root (if it doesn't exist)
2. Add these lines:

```env
# SMS - Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
YOUR_PHONE_NUMBER=+254111529709
```

Replace the values with your actual Twilio credentials.

## Step 4: Test SMS

Test that SMS is working:

```bash
npm run test-sms
```

You should receive a test SMS on your phone (+254111529709).

## Step 5: Deploy

When deploying to your hosting platform (Vercel, Netlify, etc.), make sure to add these environment variables in your platform's settings:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `YOUR_PHONE_NUMBER`

## Troubleshooting

### "Twilio not configured" error
- Make sure your `.env` file exists and has all required variables
- Check that variable names are exactly as shown (case-sensitive)

### "Invalid phone number" error
- Phone numbers must include country code (e.g., +254111529709)
- Format: +[country code][number]

### "Invalid credentials" error
- Double-check your Account SID and Auth Token from Twilio Console
- Make sure there are no extra spaces in your `.env` file

### SMS not sending
- Check your Twilio account balance
- Verify your phone number is verified in Twilio (for trial accounts)
- Check server logs for specific error messages

## How It Works

When a client submits the contact form:
1. ✅ Email is sent via mailto (opens email client)
2. ✅ SMS is sent to your phone via Twilio API
3. ✅ You receive both notifications

## Cost

- **Twilio Free Trial**: $15.50 credit (about 150-300 messages to Kenya)
- **After Trial**: ~$0.05-0.10 per SMS to Kenya
- Very affordable for a photography business!

## Need Help?

- Twilio Support: https://support.twilio.com/
- Twilio Docs: https://www.twilio.com/docs/sms
- Check server logs for detailed error messages

