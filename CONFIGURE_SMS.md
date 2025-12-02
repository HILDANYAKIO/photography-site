# Configure SMS Service - Step by Step

## Quick Start (5 minutes)

### 1. Get Twilio Account (Free Trial)

1. Go to: **https://www.twilio.com/try-twilio**
2. Sign up (takes 2 minutes)
3. Verify your email
4. You'll get **$15.50 free credit** (enough for ~150-300 messages)

### 2. Get Your Twilio Credentials

1. Go to: **https://console.twilio.com/**
2. On the dashboard, you'll see:
   - **Account SID** (starts with `AC...`) - Copy this
   - **Auth Token** (click "View" to reveal) - Copy this
3. Go to **Phone Numbers** → **Manage** → **Buy a number** (or use existing)
   - Choose a number (any country is fine, it's just for sending)
   - Copy the phone number (format: +1234567890)

### 3. Configure Your Project

**Option A: Use the setup script** (if npm works):
```bash
npm install
npm run setup-sms
```

**Option B: Manual setup**:

1. Copy `.env.template` to `.env`:
   ```bash
   copy .env.template .env
   ```
   (On Mac/Linux: `cp .env.template .env`)

2. Open `.env` in a text editor and fill in:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_actual_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   YOUR_PHONE_NUMBER=+254111529709
   ```

3. Save the file

### 4. Install Dependencies

```bash
npm install
```

**If you get PowerShell errors on Windows:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then try `npm install` again.

### 5. Test SMS

```bash
npm run test-sms
```

You should receive a test SMS on your phone!

## What Happens Next?

Once configured, when clients submit your contact form:
- ✅ **Email**: Opens in your email client (as before)
- ✅ **SMS**: Automatically sent to your phone (+254111529709)

You'll receive both notifications!

## Troubleshooting

### "Cannot find module 'twilio'"
Run: `npm install`

### "Twilio not configured"
- Check your `.env` file exists
- Verify all variables are filled in correctly
- No quotes needed around values in .env

### "Invalid phone number"
- Must include country code: `+254111529709` (not `254111529709`)
- Format: `+[country code][number]`

### "Invalid credentials"
- Double-check Account SID starts with `AC`
- Make sure Auth Token is correct (no extra spaces)
- Verify in Twilio Console

### SMS not received
- Check Twilio Console → Logs for errors
- Verify your phone number is verified (for trial accounts)
- Check account balance in Twilio

## Cost

- **Free Trial**: $15.50 credit included
- **After Trial**: ~$0.05-0.10 per SMS to Kenya
- Very affordable! Most photographers send 10-50 messages/month = $0.50-$5/month

## Need Help?

- **Twilio Support**: https://support.twilio.com/
- **Twilio Docs**: https://www.twilio.com/docs/sms
- Check your server logs for detailed error messages

## For Deployment

When deploying (Vercel, Netlify, etc.), add these environment variables in your platform settings:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`  
- `TWILIO_PHONE_NUMBER`
- `YOUR_PHONE_NUMBER`

The contact form will automatically use SMS once these are set!

