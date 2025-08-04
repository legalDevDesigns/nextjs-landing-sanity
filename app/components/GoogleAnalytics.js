'use client'

import { useEffect } from 'react'

export default function GoogleAnalytics({ trackingId }) {
  useEffect(() => {
    // Only load analytics if we have a tracking ID
    if (!trackingId || typeof window === 'undefined') {
      return
    }

    // Check if gtag is already loaded to avoid duplicate scripts
    if (window.gtag) {
      // Configure the new tracking ID
      window.gtag('config', trackingId, {
        page_title: document.title,
        page_location: window.location.href,
      })
      return
    }

    // Load Google Analytics script
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
    script.async = true
    document.head.appendChild(script)

    // Initialize gtag
    script.onload = () => {
      window.dataLayer = window.dataLayer || []
      function gtag() {
        window.dataLayer.push(arguments)
      }
      window.gtag = gtag

      gtag('js', new Date())
      gtag('config', trackingId, {
        page_title: document.title,
        page_location: window.location.href,
      })
    }

    // Cleanup function to remove script if component unmounts
    return () => {
      const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${trackingId}"]`)
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [trackingId])

  // This component doesn't render anything visible
  return null
}

// Helper function to track custom events
export function trackEvent(eventName, parameters = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}

// Helper function to track page views (useful for client-side routing)
export function trackPageView(url, title) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', window.GA_TRACKING_ID, {
      page_title: title,
      page_location: url,
    })
  }
}

// Helper function to track form submissions
export function trackFormSubmission(formName = 'contact_form', value = 0) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_submit', {
      event_category: 'engagement',
      event_label: formName,
      value: value,
    })
  }
}

// Helper function to track phone number clicks
export function trackPhoneClick(phoneNumber) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'phone_click', {
      event_category: 'engagement',
      event_label: phoneNumber,
      value: 1,
    })
  }
}

// Helper function to track CTA button clicks
export function trackCTAClick(buttonText, buttonLocation = 'unknown') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cta_click', {
      event_category: 'engagement',
      event_label: `${buttonText} - ${buttonLocation}`,
      value: 1,
    })
  }
}