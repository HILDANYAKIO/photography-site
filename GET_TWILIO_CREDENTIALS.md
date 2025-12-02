# How to Get Your Twilio Credentials

Follow these steps to get your Twilio credentials and add them to your `.env` file.

## Step 1: Sign Up for Twilio (2 minutes)

1. Go to: **https://www.twilio.com/try-twilio**
2. Click "Sign up" or "Start Free Trial"
3. Fill in:
   - Email address
   - Password
   - Phone number (for verification)
4. Verify your email and phone number
5. **You'll get $15.50 free credit!** (enough for ~150-300 messages)

## Step 2: Get Your Account SID and Auth Token

1. After signing up, you'll be taken to the **Twilio Console Dashboard**
   - Or go to: **https://console.twilio.com/**

2. On the dashboard, you'll see:
   - **Account SID** - Copy this (starts with `AC...`)
   - **Auth Token** - Click "View" to reveal it, then copy

3. These are your main credentials!

## Step 3: Get a Twilio Phone Number

You need a Twilio phone number to send SMS from:

1. In Twilio Console, go to: **Phone Numbers** → **Manage** → **Buy a number**
2. Click "Buy a number"
3. Choose:
   - **Country**: Any (US is fine, it's just for sending)
   - **Capabilities**: Check "SMS"
   - Click "Search"
4. Select a number and click "Buy"
5. Copy the phone number (format: +1234567890)

## Step 4: Add Credentials to .env File

Open your `.env` file and replace these values:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_actual_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
YOUR_PHONE_NUMBER=+254111529709
```

**Important:**
- Replace `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual Account SID
- Replace `your_actual_auth_token_here` with your actual Auth Token
- Replace `+1234567890` with your Twilio phone number
- Keep `YOUR_PHONE_NUMBER=+254111529709` (this is where SMS will be sent)

## Step 5: Test It!

After saving your `.env` file, test SMS:

```bash
npm run test-sms
```

You should receive a test SMS on your phone!

## Quick Links

- **Sign Up**: https://www.twilio.com/try-twilio
- **Console**: https://console.twilio.com/
- **Buy Number**: https://console.twilio.com/us1/develop/phone-numbers/manage/search
- **Documentation**: https://www.twilio.com/docs/sms

## Troubleshooting

### "I can't find my Account SID"
- It's on the main dashboard when you log in
- Starts with `AC` followed by 32 characters

### "I can't see my Auth Token"
- Click the "View" button next to Auth Token
- It will reveal the token (you can only see it once, so copy it!)

### "I don't have a phone number"
- Go to Phone Numbers → Buy a number
- For trial accounts, you can get a free number
- Any country works (US is fine)

### "Test SMS didn't work"
- Make sure all values in `.env` are correct (no extra spaces)
- Check that your phone number format is correct: `+254111529709`
- Verify your Twilio account has credit/balance

## Need Help?

- **Twilio Support**: https://support.twilio.com/
- **Live Chat**: Available in Twilio Console
- **Documentation**: https://www.twilio.com/docs/sms

