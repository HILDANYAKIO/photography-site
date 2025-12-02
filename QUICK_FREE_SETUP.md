# Quick FREE SMS Setup (5 Minutes) 🚀

## Option 1: Interactive Setup (Easiest)

Just run:
```bash
npm install
npm run setup-free-sms
```

The script will guide you through everything!

## Option 2: Manual Setup

### Step 1: Get Gmail App Password

1. **Go to Google Account Security**:
   - Visit: https://myaccount.google.com/security
   - Or: Google Account → Security

2. **Enable 2-Step Verification** (if not already):
   - Click "2-Step Verification"
   - Follow the steps to enable it
   - This is required for App Passwords

3. **Create App Password**:
   - Go back to Security page
   - Search for "App passwords" or click it
   - Select:
     - App: "Mail"
     - Device: "Other (Custom name)"
     - Name: "SMS Gateway"
   - Click "Generate"
   - **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)
   - Remove spaces: `abcdefghijklmnop`

### Step 2: Create .env File

Create a file named `.env` in your project folder with:

```env
# FREE SMS - Email-to-SMS Gateway (100% Free!)
USE_EMAIL_TO_SMS=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcdefghijklmnop
YOUR_PHONE_NUMBER=+254111529709
```

**Replace:**
- `your-email@gmail.com` → Your actual Gmail address
- `abcdefghijklmnop` → Your 16-character App Password (no spaces)
- `+254111529709` → Your phone number (if different)

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Test It!

```bash
npm run test-free-sms
```

You should receive a test SMS on your phone! 📱

## Using Other Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

## Troubleshooting

### "Authentication failed"
- **Gmail**: Make sure you're using an App Password, not your regular password
- **Gmail**: Verify 2-Step Verification is enabled
- **Outlook**: Try enabling "Less secure app access" in account settings

### "Connection failed"
- Check your internet connection
- Verify SMTP_HOST and SMTP_PORT are correct
- Try port 465 with SMTP_SECURE=true

### "SMS not received"
- Wait 1-2 minutes (carrier delays are normal)
- Check your phone number format: +254111529709
- Verify you're on Safaricom network (most common in Kenya)

## How It Works

1. Your server sends email to: `111529709@sms.safaricom.co.ke`
2. Safaricom converts email → SMS
3. You receive SMS on your phone
4. **Cost: $0.00** 💰

## Next Steps

Once setup is complete:
- ✅ Contact form will automatically send SMS
- ✅ You'll receive both email AND SMS
- ✅ No monthly fees or charges
- ✅ Unlimited messages

Enjoy your FREE SMS notifications! 🎉

