export const metadata = {
  title: {
    default: "Your Business Name - Insurance Services",
    template: "%s | Your Business Name"
  },
  description: "Professional insurance services including business, condo, and life insurance. Get comprehensive coverage tailored to your needs.",
  keywords: ["insurance", "business insurance", "condo insurance", "life insurance", "coverage", "protection"],
  authors: [{ name: "Your Business Name" }],
  creator: "Your Business Name",
  publisher: "Your Business Name",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourwebsite.com",
    siteName: "Your Business Name",
    title: "Your Business Name - Insurance Services",
    description: "Professional insurance services including business, condo, and life insurance. Get comprehensive coverage tailored to your needs.",
    images: [
      {
        url: "/images/1hero.jpg",
        width: 1200,
        height: 630,
        alt: "Your Business Name - Insurance Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Business Name - Insurance Services",
    description: "Professional insurance services including business, condo, and life insurance. Get comprehensive coverage tailored to your needs.",
    images: ["/images/1hero.jpg"],
    creator: "@yourbusiness",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
} 