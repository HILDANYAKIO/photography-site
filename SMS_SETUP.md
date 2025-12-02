# SMS Setup Guide

This guide explains how to configure SMS notifications for your contact form. When clients submit the contact form, messages will be sent to both your email and your phone via SMS.

## Phone Number Configuration

Your phone number is already configured: **+254111529709**

To change it, update the `YOUR_PHONE_NUMBER` environment variable in your `.env` file.

## Option 1: Twilio (Recommended)

Twilio is the easiest and most reliable option for international SMS, especially for Kenya.

### Setup Steps:

1. **Sign up for Twilio**
   - Go to https://www.twilio.com/
   - Create a free account (includes $15.50 credit for testing)
   - Verify your email and phone number

2. **Get your credentials**
   - Go to your Twilio Console Dashboard
   - Find your **Account SID** and **Auth Token**
   - Get a phone number from Twilio (or use your existing one)

3. **Install Twilio SDK** (if using Node.js/Express)
   ```bash
   npm install twilio
   ```

4. **Set environment variables**
   Add these to your `.env` file:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   YOUR_PHONE_NUMBER=+254111529709
   ```

5. **Test**
   - Submit the contact form on your website
   - Check your phone for the SMS message
   - Check your email as well

### Twilio Pricing
- Kenya: ~$0.05-0.10 per SMS
- Free trial includes $15.50 credit (about 150-300 messages)

## Option 2: AWS SNS (Alternative)

If you prefer AWS or already have an AWS account:

### Setup Steps:

1. **Create AWS Account** (if needed)
   - Go to https://aws.amazon.com/
   - Sign up for an account

2. **Get AWS Credentials**
   - Go to AWS IAM Console
   - Create a user with SNS permissions
   - Get Access Key ID and Secret Access Key

3. **Install AWS SDK** (if using Node.js/Express)
   ```bash
   npm install aws-sdk
   ```

4. **Set environment variables**
   Add these to your `.env` file:
   ```
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=us-east-1
   YOUR_PHONE_NUMBER=+254111529709
   ```

### AWS SNS Pricing
- Kenya: ~$0.00645 per SMS
- Very cost-effective for high volume

## Option 3: Local SMS Gateway (Kenya-specific)

For Kenya, you might also consider:
- **Africa's Talking**: https://africastalking.com/
- **SMS Gateway API**: Various local providers

These may offer better rates for Kenya-specific numbers.

## Testing

After setup:

1. Fill out the contact form on your website
2. Submit it
3. You should receive:
   - An email (via mailto link)
   - An SMS on your phone (+254111529709)

## Troubleshooting

### SMS not working but email works
- Check that environment variables are set correctly
- Verify your SMS service credentials
- Check server logs for error messages
- Ensure your phone number format is correct (+254111529709)

### SMS service not configured
- The form will still work and send email
- SMS will be skipped if no service is configured
- Check the server logs for warnings

### Testing without SMS service
- The form will still work normally
- Email will be sent via mailto
- SMS will be skipped gracefully

## Security Notes

- Never commit your `.env` file to version control
- Keep your API keys secret
- Use environment variables, not hardcoded values
- Consider rate limiting for the SMS endpoint

## Support

If you need help setting up SMS:
1. Check the server logs for specific error messages
2. Verify your environment variables are loaded correctly
3. Test your SMS service credentials independently
4. Contact your SMS service provider's support

