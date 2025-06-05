'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { urlFor } from './sanity/lib/client';

// Helper function to determine grid classes based on feature count
const getFeatureGridClass = (count) => {
  if (count === 4) {
    return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8';
  }
  if (count === 5) {
    // For 5 items, this will be 3 on top, 2 on bottom (left-aligned).
    // True centering of the bottom 2 is more complex with pure Tailwind grid.
    return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8';
  }
  if (count === 7) {
    // For 7 items, this will be 3, 3, 1 (last one left-aligned by default).
    // We'll add specific styling to the last item to center it.
    return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8';
  }
  // Default for 1, 2, 3, 6, etc.
  return 'grid grid-cols-1 md:grid-cols-3 gap-8';
};

// Helper function to convert hex to RGBA
const hexToRgba = (hex, alpha = 1) => {
  if (!hex || typeof hex !== 'string') return null; // Return null or a default if hex is invalid
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Define custom components for Portable Text if needed
const portableTextComponents = {
  // types: { ... }, // If you have custom block types
  // marks: { ... }, // If you have custom marks
}

export default function HomeClient({ siteData }) {
  // Remove formData and formStatus state unless used elsewhere
  // const [formData, setFormData] = useState({ ... });
  // const [formStatus, setFormStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(''); // '', 'success', 'error'

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Helper to render feature icons
  const renderIcon = (feature) => {
    if (feature.iconType === 'icon' && feature.icon?.svg) {
      return <div dangerouslySetInnerHTML={{ __html: feature.icon.svg }} className="text-4xl mb-4" />;
    } else if (feature.iconType === 'custom' && feature.customIconClass) {
      return <i className={`${feature.customIconClass} text-4xl mb-4`}></i>;
    } 
    return null;
  };

  // Define RenderFeatureCard component here
  const RenderFeatureCard = ({ feature, cardKey, className = '' }) => {
    const featureImageUrl = urlFor(feature.image?.asset)?.url();
    // renderIcon is available in this scope as it's part of HomeClient
    return (
      <div key={cardKey} className={`group bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col ${className}`}>
        {featureImageUrl && (
          <div className="relative h-48 mb-4 rounded overflow-hidden">
            <Image src={featureImageUrl} alt={feature.image?.alt || feature.title || 'Feature image'} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        )}
        {renderIcon(feature)}
        {feature.title && <h3 className="text-xl font-bold mb-2">{feature.title}</h3>}
        {feature.description && <p className="text-gray-600">{feature.description}</p>}
      </div>
    );
  };

  // Helper to handle Netlify form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');
    const formData = new FormData(event.target);

    try {
      const response = await fetch('/__forms.html', { // Target the static HTML form
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Optionally clear the form or show a success message
        event.target.reset(); // Clear form fields
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!siteData || siteData.title === 'Page Not Found') {
    return <div className="min-h-screen flex items-center justify-center"><h1>Landing Page Not Found</h1></div>;
  }

  // Use a safeguard for the entire siteData object
  const safeSiteData = siteData || {};

  // Extract nested data with safeguards from safeSiteData
  const businessInfo = safeSiteData.businessInfo || {};
  const hero = safeSiteData.hero || {};
  const mainFeatures = safeSiteData.mainFeatures || [];
  const secondaryFeatures = safeSiteData.secondaryFeatures || [];
  const about = safeSiteData.about || {};
  const testimonials = safeSiteData.testimonials || [];
  const extraContentSection = safeSiteData.extraContentSection || [];
  const ctaBlock1 = safeSiteData.ctaBlock1 || {};
  const ctaBlock2 = safeSiteData.ctaBlock2 || {};
  const map = safeSiteData.map || {};

  // Define default theme colors
  const DEFAULT_PRIMARY_COLOR = '#2864ec'; // Default Button Color
  const DEFAULT_SECONDARY_COLOR = '#203c9c'; // Default Header Color

  const TEXT_LIGHT = '#FFFFFF';
  const TEXT_DARK = '#212529'; // A common dark color

  // Extract colors and text color choices
  const useDefaultTheme = safeSiteData.useDefaultTheme;
  const primaryColor = useDefaultTheme ? DEFAULT_PRIMARY_COLOR : (safeSiteData.primaryColorValue || DEFAULT_PRIMARY_COLOR);
  const secondaryColor = useDefaultTheme ? DEFAULT_SECONDARY_COLOR : (safeSiteData.secondaryColorValue || DEFAULT_SECONDARY_COLOR);

  const buttonTextColor = useDefaultTheme ? TEXT_LIGHT : (safeSiteData.buttonTextColorChoice === 'dark' ? TEXT_DARK : TEXT_LIGHT);
  const headerFooterTextColor = useDefaultTheme ? TEXT_LIGHT : (safeSiteData.headerFooterTextColorChoice === 'dark' ? TEXT_DARK : TEXT_LIGHT);

  // Pre-build image URLs - Pass the .asset object to urlFor
  const heroImageUrl = urlFor(hero.backgroundImage?.asset)?.url();
  const aboutImageUrl = urlFor(about.image?.asset)?.url();
  const ctaBlock1ImageUrl = ctaBlock1?.backgroundImage ? urlFor(ctaBlock1.backgroundImage?.asset)?.url() : null;
  const ctaBlock2ImageUrl = ctaBlock2?.backgroundImage ? urlFor(ctaBlock2.backgroundImage?.asset)?.url() : null;

  return (
    <main className="min-h-screen">
      {/* Remove the commented out block below */}
      {/* 
      <form name="contact" netlify="true" netlify-honeypot="bot-field" hidden>
        <input type="text" name="name" />
        <input type="email" name="email" />
        <input type="tel" name="phone" />
        <textarea name="message"></textarea>
      </form>
      */}

      {/* Top Bar - Uses businessInfo */}
      {businessInfo.name && (
        <div style={{ backgroundColor: secondaryColor, color: headerFooterTextColor }} className="py-2 px-4 w-full z-50">
          <div className="container mx-auto flex justify-between items-center">
            <span className="font-bold">{businessInfo.name}</span>
            <div className="flex space-x-4">
              {businessInfo.phone && <a href={`tel:${businessInfo.phone}`} style={{ color: headerFooterTextColor }} className="hover:opacity-80 text-sm">{businessInfo.phone}</a>}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed Top Bar - only if Top Bar is visible */}
      {/* {businessInfo.name && <div className="h-10"></div>} */}

      {/* Hero Section - Uses hero, businessInfo */}
      {hero.title && (
        <section className="relative min-h-screen flex items-center justify-center pt-16">
          {heroImageUrl && (
            <div className="absolute inset-0 z-0">
              <Image src={heroImageUrl} alt={hero.backgroundImage?.alt || hero.title || 'Hero background'} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          )}
          <div className="container mx-auto px-4 z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-white text-left">
                <h1 style={{ color: 'white' }} className="text-4xl md:text-5xl font-bold mb-4">{hero.title}</h1>
                {hero.subtitle && <p style={{ color: 'white' }} className="text-lg md:text-xl mb-8">{hero.subtitle}</p>}
                {businessInfo.phone && (
                  <a 
                    href={`tel:${businessInfo.phone}`}
                    style={{ backgroundColor: primaryColor, color: buttonTextColor }}
                    className="inline-block px-8 py-3 rounded-lg font-bold hover:opacity-80 transition-opacity duration-300"
                  >
                    Call Now
                  </a>
                )}
              </div>
              {hero.formTitle && (
                <div className="flex justify-center md:justify-end">
                  <form
                    id="contact-form"
                    name="contact"
                    method="POST"
                    onSubmit={handleFormSubmit} // Add onSubmit handler
                    className="w-full max-w-md bg-white/10 backdrop-blur-sm p-8 rounded-lg"
                  >
                    {/* Keep standard hidden inputs */}
                    <input type="hidden" name="form-name" value="contact" />
                    <p hidden><label>Don't fill this out if you're human: <input name="bot-field" /></label></p>
                    <h2 className="text-2xl font-semibold mb-6 text-white">{hero.formTitle}</h2>
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        required
                        className="w-full px-4 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        required
                        className="w-full px-4 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Your Phone"
                        className="w-full px-4 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      <textarea
                        name="message"
                        placeholder="Your Message"
                        required
                        rows="4"
                        className="w-full px-4 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                      ></textarea>
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        style={{ backgroundColor: primaryColor, color: buttonTextColor }}
                        className="w-full mt-6 px-6 py-3 rounded-lg hover:opacity-80 transition-opacity duration-300 disabled:opacity-50"
                        disabled={isSubmitting} // Disable button while submitting
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                    {/* Add Success/Error Messages */}
                    {submitStatus === 'success' && (
                      <p className="mt-4 text-center text-green-400">Thanks for your message! We'll be in touch soon.</p>
                    )}
                    {submitStatus === 'error' && (
                      <p className="mt-4 text-center text-red-400">Something went wrong. Please try again later.</p>
                    )}
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main Feature Cards */}
      {mainFeatures.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className={getFeatureGridClass(mainFeatures.length)}>
              {mainFeatures.length === 5 ? (
                <>
                  {mainFeatures.slice(0, 3).map((feature) => (
                    <RenderFeatureCard
                      feature={feature}
                      cardKey={feature._key || feature._id}
                      key={feature._key || feature._id}
                    />
                  ))}
                  <div className="md:col-span-3 flex justify-center pt-8"> {/* pt-8 for vertical gap if needed */}
                    <div className="flex flex-col sm:flex-row gap-8 w-full items-stretch sm:justify-center">
                      <div className="w-full sm:w-1/2 md:max-w-md lg:max-w-lg">
                        <RenderFeatureCard
                          feature={mainFeatures[3]}
                          cardKey={mainFeatures[3]._key || mainFeatures[3]._id}
                          key={mainFeatures[3]._key || mainFeatures[3]._id}
                        />
                      </div>
                      <div className="w-full sm:w-1/2 md:max-w-md lg:max-w-lg">
                        <RenderFeatureCard
                          feature={mainFeatures[4]}
                          cardKey={mainFeatures[4]._key || mainFeatures[4]._id}
                          key={mainFeatures[4]._key || mainFeatures[4]._id}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                mainFeatures.map((feature, index) => {
                  let cardSpecificClass = "";
                  const count = mainFeatures.length;
                  if (count === 7 && index === 6) {
                    cardSpecificClass = "md:col-start-2";
                  }
                  // For count = 4, getFeatureGridClass sets md:grid-cols-2, handled by parent.
                  // Default cases fall through to RenderFeatureCard without specific offset/sizing classes.
                  return (
                    <RenderFeatureCard
                      feature={feature}
                      cardKey={feature._key || feature._id}
                      className={cardSpecificClass}
                      key={feature._key || feature._id}
                    />
                  );
                })
              )}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      {about.title && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {aboutImageUrl && (
                <div className="relative h-[400px] rounded-lg overflow-hidden">
                  <Image src={aboutImageUrl} alt={about.image?.alt || about.title || 'About Us'} fill className="object-cover" />
                </div>
              )}
              <div>
                <h2 className="text-3xl font-bold mb-4">{about.title}</h2>
                {about.description && <p className="text-gray-600">{about.description}</p>}
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* --- Render Flexible Content Section --- */}
      {extraContentSection && extraContentSection.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 prose lg:prose-xl">
            <PortableText 
              value={extraContentSection} 
              components={portableTextComponents}
            />
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => {
                // Pass testimonial.avatar.asset to urlFor
                const avatarImageUrl = urlFor(testimonial.avatar?.asset)?.url();
                return (
                  <div key={testimonial._key} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center mb-4">
                      {avatarImageUrl && (
                        <div className="relative h-16 w-16 mr-4 rounded-full overflow-hidden">
                          <Image src={avatarImageUrl} alt={testimonial.avatar?.alt || testimonial.author || 'Client Avatar'} fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        {testimonial.author && <p className="font-bold">{testimonial.author}</p>}
                        {testimonial.position && <p className="text-gray-500">{testimonial.position}</p>}
                      </div>
                    </div>
                    {testimonial.quote && <p className="text-gray-600 italic">"{testimonial.quote}"</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Block 1 - uses ctaBlock1 */}
      {ctaBlock1.heading && (
        <section className="py-16 relative overflow-hidden bg-gray-800 text-white">
          {ctaBlock1ImageUrl && (
            <div className="absolute inset-0 z-0">
              <Image src={ctaBlock1ImageUrl} alt={ctaBlock1.backgroundImage?.alt || ctaBlock1.heading || 'CTA Background 1'} fill className="object-cover" />
              <div style={{ backgroundColor: hexToRgba(secondaryColor, 0.8) }} className="absolute inset-0"></div>
            </div>
          )}
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{ctaBlock1.heading}</h2>
            {ctaBlock1.subheading && <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">{ctaBlock1.subheading}</p>}
            {ctaBlock1.buttonText && (
              <a
                href={ctaBlock1.buttonAction === 'form' ? '#contact-form' : (ctaBlock1.buttonAction === 'phone' && businessInfo.phone ? `tel:${businessInfo.phone}` : '#')}
                onClick={ctaBlock1.buttonAction === 'form' ? (e) => { e.preventDefault(); document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }); } : undefined}
                style={{ backgroundColor: primaryColor, color: buttonTextColor }}
                className="px-8 py-3 rounded-lg font-bold hover:opacity-80 transition-opacity duration-300 text-lg"
              >
                {ctaBlock1.buttonText}
              </a>
            )}
          </div>
        </section>
      )}

      {/* Secondary Feature Cards */}
      {secondaryFeatures.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className={getFeatureGridClass(secondaryFeatures.length)}>
              {secondaryFeatures.length === 5 ? (
                <>
                  {secondaryFeatures.slice(0, 3).map((feature) => (
                    <RenderFeatureCard
                      feature={feature}
                      cardKey={feature._key || feature._id}
                      key={feature._key || feature._id}
                    />
                  ))}
                  <div className="md:col-span-3 flex justify-center pt-8"> {/* pt-8 for vertical gap if needed */}
                    <div className="flex flex-col sm:flex-row gap-8 w-full items-stretch sm:justify-center">
                      <div className="w-full sm:w-1/2 md:max-w-md lg:max-w-lg">
                        <RenderFeatureCard
                          feature={secondaryFeatures[3]}
                          cardKey={secondaryFeatures[3]._key || secondaryFeatures[3]._id}
                          key={secondaryFeatures[3]._key || secondaryFeatures[3]._id}
                        />
                      </div>
                      <div className="w-full sm:w-1/2 md:max-w-md lg:max-w-lg">
                        <RenderFeatureCard
                          feature={secondaryFeatures[4]}
                          cardKey={secondaryFeatures[4]._key || secondaryFeatures[4]._id}
                          key={secondaryFeatures[4]._key || secondaryFeatures[4]._id}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                secondaryFeatures.map((feature, index) => {
                  let cardSpecificClass = "";
                  const count = secondaryFeatures.length;
                  if (count === 7 && index === 6) {
                    cardSpecificClass = "md:col-start-2";
                  }
                  // For count = 4, getFeatureGridClass sets md:grid-cols-2, handled by parent.
                  // Default cases fall through to RenderFeatureCard without specific offset/sizing classes.
                  return (
                    <RenderFeatureCard
                      feature={feature}
                      cardKey={feature._key || feature._id}
                      className={cardSpecificClass}
                      key={feature._key || feature._id}
                    />
                  );
                })
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Block 2 - uses ctaBlock2 */}
      {ctaBlock2.heading && (
        <section className="py-16 relative overflow-hidden bg-gray-700 text-white">
          {ctaBlock2ImageUrl && (
            <div className="absolute inset-0 z-0">
              <Image src={ctaBlock2ImageUrl} alt={ctaBlock2.backgroundImage?.alt || ctaBlock2.heading || 'CTA Background 2'} fill className="object-cover" />
              <div style={{ backgroundColor: hexToRgba(primaryColor, 0.8) }} className="absolute inset-0"></div>
            </div>
          )}
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{ctaBlock2.heading}</h2>
            {ctaBlock2.subheading && <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">{ctaBlock2.subheading}</p>}
            {ctaBlock2.buttonText && (
              <a
                href={ctaBlock2.buttonAction === 'form' ? '#contact-form' : (ctaBlock2.buttonAction === 'phone' && businessInfo.phone ? `tel:${businessInfo.phone}` : '#')}
                onClick={ctaBlock2.buttonAction === 'form' ? (e) => { e.preventDefault(); document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }); } : undefined}
                style={{ backgroundColor: secondaryColor, color: buttonTextColor }}
                className="px-8 py-3 rounded-lg font-bold hover:opacity-80 transition-opacity duration-300 text-lg"
              >
                {ctaBlock2.buttonText}
              </a>
            )}
          </div>
        </section>
      )}

      {/* Contact Section - uses businessInfo, map */}
      {(businessInfo.phone || businessInfo.email || businessInfo.address || (map?.embedUrl && map?.showMap !== false)) && (
        <section className="py-16 bg-gradient-to-br from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
                <div className="space-y-4">
                  {businessInfo.phone && <p><strong>Phone:</strong> <a href={`tel:${businessInfo.phone}`} style={{ color: useDefaultTheme ? TEXT_DARK : (safeSiteData.headerFooterTextColorChoice === 'light' ? TEXT_DARK : headerFooterTextColor) }} className="hover:underline">{businessInfo.phone}</a></p>}
                  {businessInfo.email && <p><strong>Email:</strong> <a href={`mailto:${businessInfo.email}`} style={{ color: useDefaultTheme ? TEXT_DARK : (safeSiteData.headerFooterTextColorChoice === 'light' ? TEXT_DARK : headerFooterTextColor) }} className="hover:underline">{businessInfo.email}</a></p>}
                  {businessInfo.address && <p><strong>Address:</strong> {businessInfo.address}</p>}
                  {businessInfo.hoursOfOperation && <p><strong>Hours:</strong> <span className="whitespace-pre-line">{businessInfo.hoursOfOperation}</span></p>}
                </div>
                <button 
                  onClick={scrollToTop} 
                  style={{ backgroundColor: primaryColor, color: buttonTextColor }}
                  className="mt-6 px-8 py-3 rounded-lg font-bold hover:opacity-80 transition-opacity duration-300"
                >
                  Contact Us
                </button>
              </div>
              {map?.embedUrl && map?.showMap !== false && (
                <div className="h-64 rounded-lg overflow-hidden shadow-lg">
                  <iframe src={map.embedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full h-full"></iframe>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer - uses businessInfo */}
      {(businessInfo.name || businessInfo.phone || businessInfo.email || businessInfo.address) && (
        <footer style={{ backgroundColor: secondaryColor, color: headerFooterTextColor }} className="py-8">
          <div className="container mx-auto px-4 text-center">
            {businessInfo.name && <h3 style={{ color: headerFooterTextColor }} className="text-xl font-bold mb-4">{businessInfo.name}</h3>}
            {businessInfo.address && <p style={{ color: headerFooterTextColor }} className="mb-2 opacity-80">{businessInfo.address}</p>}
            <div className="flex justify-center space-x-4 mb-4">
              {businessInfo.phone && <a href={`tel:${businessInfo.phone}`} style={{ color: headerFooterTextColor }} className="hover:opacity-80">{businessInfo.phone}</a>}
              {businessInfo.email && <a href={`mailto:${businessInfo.email}`} style={{ color: headerFooterTextColor }} className="hover:opacity-80">{businessInfo.email}</a>}
            </div>
            <p style={{ color: headerFooterTextColor }} className="text-sm opacity-70" suppressHydrationWarning>&copy; {new Date().getFullYear()} {businessInfo.name || 'Your Company'}. All rights reserved.</p>
          </div>
        </footer>
      )}
    </main>
  );
} 