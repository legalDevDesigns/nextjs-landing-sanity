# Google Analytics Setup

This document explains how Google Analytics tracking has been implemented in your Sanity + Next.js application.

## Overview

Google Analytics tracking is now configured per-site, allowing each landing page to have its own tracking ID. This enables you to track each site separately in Google Analytics.

## How It Works

### 1. Sanity Schema
A new field `googleAnalyticsId` has been added to the `landingPage` schema in the "SEO & Settings" tab. This allows you to set a unique Google Analytics tracking ID for each site.

### 2. Next.js Integration
The `GoogleAnalytics` component automatically loads the Google Analytics script when a valid tracking ID is provided from your Sanity document.

### 3. Automatic Tracking
- **Page views**: Automatically tracked when the page loads
- **Form submissions**: Can be tracked using the provided helper functions
- **Phone clicks**: Can be tracked using the provided helper functions
- **CTA clicks**: Can be tracked using the provided helper functions

## Setting Up Google Analytics

### Step 1: Create Google Analytics Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for each site/domain
3. Copy the tracking ID (format: `G-XXXXXXXXXX`)

### Step 2: Add Tracking ID to Sanity
1. Open your Sanity Studio
2. Edit a landing page document
3. Go to the "SEO & Settings" tab
4. Enter the Google Analytics tracking ID in the "Google Analytics Tracking ID" field
5. Save the document

### Step 3: Deploy and Test
1. Deploy your changes
2. Visit your site
3. Check Google Analytics real-time reports to verify tracking is working

## Advanced Event Tracking

The implementation includes helper functions for tracking custom events:

### Form Submissions
```javascript
import { trackFormSubmission } from '../components/GoogleAnalytics';

// Track when a contact form is submitted
trackFormSubmission('contact_form', 1);
```

### Phone Number Clicks
```javascript
import { trackPhoneClick } from '../components/GoogleAnalytics';

// Track when someone clicks a phone number
trackPhoneClick('555-123-4567');
```

### CTA Button Clicks
```javascript
import { trackCTAClick } from '../components/GoogleAnalytics';

// Track CTA button clicks
trackCTAClick('Get Quote', 'hero_section');
```

### Custom Events
```javascript
import { trackEvent } from '../components/GoogleAnalytics';

// Track any custom event
trackEvent('video_play', {
  event_category: 'engagement',
  event_label: 'homepage_video',
  value: 1
});
```

## Implementation Details

### Files Modified
- `studio/schemaTypes/landingPage.js` - Added `googleAnalyticsId` field
- `app/page.js` - Updated query to fetch Google Analytics ID
- `app/components/GoogleAnalytics.js` - New component for GA integration
- `app/HomeClient.js` - Integrated GoogleAnalytics component

### Security & Privacy
- Analytics only loads when a valid tracking ID is provided
- No tracking occurs without explicit configuration
- Component follows Google Analytics 4 best practices
- Scripts are loaded asynchronously to avoid blocking page rendering

## Troubleshooting

### Tracking Not Working
1. Verify the tracking ID format is correct (G-XXXXXXXXXX)
2. Check browser developer console for any JavaScript errors
3. Use Google Analytics Real-Time reports to test
4. Ensure the tracking ID is properly saved in Sanity

### Multiple Sites
- Each landing page document should have its own unique tracking ID
- Create separate Google Analytics properties for each site/domain
- Use different tracking IDs for development vs production

### Testing
- Use Google Analytics Real-Time reports for immediate feedback
- Test on different devices and browsers
- Verify events are firing in the GA4 debug view

## Best Practices

1. **Separate Properties**: Create separate GA properties for each site for clear data separation
2. **Environment Separation**: Use different tracking IDs for development and production
3. **Event Naming**: Use consistent naming conventions for custom events
4. **Privacy Compliance**: Ensure compliance with GDPR/CCPA requirements in your privacy policy
5. **Regular Monitoring**: Set up alerts and regularly review analytics data

## Next Steps

Consider implementing additional tracking for:
- Scroll depth tracking
- Download tracking
- External link clicks
- Video engagement
- E-commerce events (if applicable)

For more advanced analytics setup, consider integrating Google Tag Manager for more complex tracking scenarios.