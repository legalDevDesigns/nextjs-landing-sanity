const basePath = '';  // Remove the conditional basePath for Netlify

export const siteConfig = {
  business: {
    name: "Your Business Name",
    phone: "(555) 123-4567",
    email: "contact@yourbusiness.com",
    address: "123 Business Street, City, State 12345",
  },
  hero: {
    title: "Welcome to Your Business",
    subtitle: "Your trusted partner in excellence",
    backgroundImage: `/images/1hero.jpg`,
    formTitle: "Request a Quote",
    formPlaceholder: "Enter your details",
  },
  features: {
    main: [
      {
        title: "Business Insurance",
        description: "Comprehensive coverage for your business needs",
        icon: "🏢",
        image: `/images/Business-Insurance-2.jpg`
      },
      {
        title: "Condo Insurance",
        description: "Protection for your condominium property",
        icon: "🏠",
        image: `/images/Condo-Insurance.jpg`
      },
      {
        title: "Life Insurance",
        description: "Secure your family's future",
        icon: "❤️",
        image: `/images/Life-Insurance-13.jpg`
      },
    ],
    secondary: [
      {
        title: "Quality",
        description: "Premium service standards",
        icon: "⭐",
        image: `/images/Business-Insurance-2.jpg`
      },
      {
        title: "Experience",
        description: "Years of industry expertise",
        icon: "🎯",
        image: `/images/Condo-Insurance.jpg`
      },
      {
        title: "Innovation",
        description: "Cutting-edge solutions",
        icon: "💡",
        image: `/images/Life-Insurance-13.jpg`
      },
      {
        title: "Reliability",
        description: "Consistent performance",
        icon: "🛡️",
        image: `/images/Business-Insurance-2.jpg`
      },
      {
        title: "Efficiency",
        description: "Streamlined processes",
        icon: "⚡",
        image: `/images/Condo-Insurance.jpg`
      },
      {
        title: "Results",
        description: "Proven track record",
        icon: "📈",
        image: `/images/Life-Insurance-13.jpg`
      },
    ],
  },
  about: {
    title: "About Us",
    description: "We are dedicated to providing exceptional service and solutions to our clients. With years of experience and a commitment to excellence, we deliver results that exceed expectations.",
    image: `/images/3aboutUs.jpg`,
  },
  testimonials: [
    {
      quote: "Outstanding service and exceptional results!",
      author: "John Doe",
      position: "CEO, Company Name",
      avatar: `/images/Business-Insurance-2.jpg`
    },
    {
      quote: "The best in the business, hands down.",
      author: "Jane Smith",
      position: "Director, Another Company",
      avatar: `/images/Condo-Insurance.jpg`
    },
  ],
  cta: {
    primary: {
      title: "Ready to Get Started?",
      subtitle: "Contact us today for a free consultation",
      buttonText: "Request a Quote",
      backgroundImage: `/images/1hero.jpg`
    },
    secondary: {
      title: "Transform Your Business",
      subtitle: "Let's work together to achieve your goals",
      buttonText: "Get in Touch",
      backgroundImage: `/images/3aboutUs.jpg`
    },
  },
  map: {
    location: "123 Business Street, City, State 12345",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910525!2d-74.25986532962815!3d40.69714941978941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24a5b5f3c0c1d%3A0x3b0d839c0c0c0c0c!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
  },
}; 