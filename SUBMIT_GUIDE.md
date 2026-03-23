# GraphR App - App Store Submission Guide

This guide walks through submitting GraphR to the Apple App Store and Google Play Store.

## Pre-Submission Checklist

- [ ] App version incremented in app.json
- [ ] All screenshots and promotional assets prepared
- [ ] Privacy policy page created and hosted
- [ ] Terms of service page created and hosted
- [ ] Tested on real devices (iOS and Android)
- [ ] All features working correctly
- [ ] Firebase configuration updated for production
- [ ] IAP products created in App Store Connect and Google Play Console
- [ ] Signed production certificates prepared
- [ ] COPPA compliance verified

## iOS App Store Submission

### Step 1: Prepare Your Apple Developer Account

1. Go to developer.apple.com and sign in
2. Enroll in Apple Developer Program ($99/year)
3. Complete your profile and tax information
4. Accept Apple Developer Program License Agreement

### Step 2: Create App ID and Bundle ID

1. Go to Certificates, Identifiers & Profiles
2. Create new App ID
   - Name: GraphR
   - Bundle ID: com.insperion.graphr
   - Capabilities: Push Notifications, In-App Purchase
3. Register devices for testing (TestFlight)

### Step 3: Generate Signing Certificates

1. Create signing certificate via Certificate Signing Request
2. Download Development and Production certificates
3. Import into Xcode (or use Expo's automatic management)

### Step 4: Create App in App Store Connect

1. Go to App Store Connect (appstoreconnect.apple.com)
2. Click "My Apps"
3. Click "+" and select "New App"
4. Fill in:
   - Name: GraphR
   - Bundle ID: com.insperion.graphr
   - SKU: graphr-2026-001
   - Platform: iOS

### Step 5: Configure App Details

1. **App Information**
   - Name: GraphR
   - Subtitle: Calculate. Learn. Succeed.
   - Description: The world's first intuitive, all-in-one calculator app for education
   - Category: Education
   - Keywords: calculator, education, math, graphing, testing

2. **Privacy Policy**
   - Link: https://insperion.com/privacy

3. **Support URL**
   - https://insperion.com/support

4. **Contact Email**
   - support@insperion.com

### Step 6: Add Screenshots & Artwork

1. Required sizes:
   - iPhone 6.7" (Pro Max): 1290 x 2796
   - iPad 12.9" (6th gen): 2048 x 2732

2. Include 5-10 screenshots showing:
   - Calculator interface
   - Exam mode
   - Teacher dashboard
   - Analytics
   - Profile

3. App preview video (30 sec max)

### Step 7: Configure In-App Purchases

In App Store Connect:

1. Go to "In-App Purchases"
2. Click "+" to add new purchases
3. Create products matching IAP_PRODUCT_IDS:
   - com.insperion.graphr.pro_monthly ($4.99)
   - com.insperion.graphr.pro_annual ($49.99)
4. Set pricing tier
5. Review and submit

### Step 8: Configure Subscription Information

1. Subscription group: "GraphR Pro"
2. Free trial: None (offer optional)
3. Billing cycle: Monthly or Annual
4. Renewal terms and cancellation info

### Step 9: Build for Production

```bash
npm run build:ios
```

Or using Expo:

```bash
eas build --platform ios --profile production
```

### Step 10: Upload Build & Submit

1. In Xcode or via App Store Connect, upload the build
2. Select build for testing
3. Fill in beta testing feedback details
4. Submit for review

### Step 11: Review & Approval

- Apple reviews within 24-48 hours
- Common rejection reasons:
  - Misleading metadata
  - Location permission misuse
  - Incomplete privacy policy
  - IAP not properly configured

### Step 12: Release to App Store

Once approved:
1. Phased Release or Full Release
2. Monitor for crashes (Xcode Metrics)
3. Plan next update version

## Android Google Play Submission

### Step 1: Google Play Developer Account Setup

1. Go to play.google.com/apps/publish
2. Sign in with Google account
3. Pay one-time $25 registration fee
4. Complete profile and create merchant account

### Step 2: Create Application Listing

1. Click "Create app"
2. Enter details:
   - App name: GraphR
   - Default language: English
   - App or game: App
   - Category: Education

### Step 3: Prepare App Listing

1. **App Details**
   - Short description: Calculate. Learn. Succeed.
   - Full description: (same as iOS)
   - Category: Education
   - Content rating: Everyone (or age-appropriate)

2. **Screenshots** (5-8)
   - Minimum: 320 x 426 px
   - Recommended: 1080 x 1920 px

3. **Feature Graphic**
   - 1024 x 500 px

4. **Icon**
   - 512 x 512 px

5. **Video Preview**
   - 30-60 seconds

### Step 4: Configure Content Rating

1. Answer Google Play's content rating questionnaire
2. Get rating for age groups
3. Add any content warnings

### Step 5: Configure Pricing & Distribution

1. Price: Free (with IAP)
2. Countries: Select all or specific markets
3. Content restrictions: Check all applicable
4. COPPA compliance: Check if app targets minors

### Step 6: Set Up In-App Billing

1. Create products in Google Play Console:
   - com.insperion.graphr.pro_monthly
   - com.insperion.graphr.pro_annual

2. Set pricing:
   - Monthly: $4.99
   - Annual: $49.99

3. Configure:
   - Default text for purchase dialogs
   - Offer details
   - SKU for each product

### Step 7: Create Release

1. Go to Release section
2. Create new release in Production track
3. Upload APK or AAB (Android App Bundle recommended)

### Step 8: Build for Production

```bash
npm run build:android
```

### Step 9: Generate Signed APK/AAB

Use EAS:

```bash
eas build --platform android --profile production
```

Download the signed APK/AAB from Expo dashboard.

### Step 10: Upload to Google Play

1. In Google Play Console, upload AAB file
2. Wait for processing (usually instant)
3. Review auto-generated store listing

### Step 11: Review Permissions

1. Verify requested permissions are justified:
   - Camera (profile photos)
   - Location (classroom features)
   - Notifications (exam alerts)
   - External storage (exam materials)

### Step 12: Submit for Review

1. Complete all required fields
2. Accept all agreements
3. Click "Submit for Review"
4. Google typically reviews within 24 hours

### Step 13: Monitor & Update

- Monitor crash statistics in Google Play Console
- Respond to user feedback
- Plan updates and new releases

## Post-Submission

### Monitoring

1. **Set up Sentry or similar** for crash reporting
2. **Monitor ratings & reviews** for feedback
3. **Check analytics** for user engagement
4. **Track update rates** to ensure users upgrade

### Marketing

- Social media announcement
- Press release to education blogs
- Email campaign to teachers
- Teacher webinars and training

### Support

- Create support email: support@insperion.com
- Monitor help desk for issues
- Respond to app store reviews
- Plan hotfix releases if needed

## Common Issues & Solutions

### Issue: IAP Not Appearing in App

**Solution:**
- Verify product IDs exactly match
- Check bundle ID matches
- Wait 24 hours for products to sync
- Verify payment method on app store account

### Issue: App Rejected for Privacy

**Solution:**
- Add detailed privacy policy
- Explain all data collection
- Ensure COPPA compliance
- Get privacy reviewed by legal counsel

### Issue: Location Permission Rejected

**Solution:**
- Only request location for essential features
- Explain why location is needed
- Offer app to work without location
- Consider using other APIs

### Issue: Build Upload Failed

**Solution:**
- Verify bundle ID matches
- Check signing certificate validity
- Use latest Xcode version
- Re-generate signing credentials

## Important Links

- Apple App Store Connect: https://appstoreconnect.apple.com
- Google Play Console: https://play.google.com/apps/publish
- Expo Docs: https://docs.expo.dev/distribution/building-on-ci/
- GraphR Privacy Policy: https://insperion.com/privacy
- GraphR Support: support@insperion.com

## Timeline

Typical submission to approval:

- **iOS**: 24-48 hours for review, plus 5-10 minutes for automated processing
- **Android**: 2-24 hours for review
- **Total**: Plan for 1 week from initial submission to live release

## Version Management

For future updates:

1. Increment version in app.json
2. Increment build number (eas.json)
3. Update CHANGELOG
4. Rebuild with EAS
5. Submit new build to both stores

Good luck! Help teachers keep phones as educational tools.

**#CalculatingTheFuture**
