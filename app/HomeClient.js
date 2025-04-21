'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { urlFor } from './sanity/lib/client';

// Define custom components for Portable Text if needed
const portableTextComponents = {
  // types: { ... }, // If you have custom block types
  // marks: { ... }, // If you have custom marks
}

export default function HomeClient({ siteData }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formBody = new URLSearchParams({
        'form-name': 'contact',
        ...formData
      }).toString();
      
      console.log('Submitting form with data:', formBody);
      
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
        alert('Thank you for your message! We will get back to you soon.');
      } else {
        const responseText = await response.text();
        console.error('Form submission error:', responseText);
        throw new Error('Form submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your message. Please try again.');
    }
  };

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
  const primaryCta = safeSiteData.primaryCta || {};
  const secondaryCta = safeSiteData.secondaryCta || {};
  const map = safeSiteData.map || {};

  // Pre-build image URLs - Pass the .asset object to urlFor
  const heroImageUrl = urlFor(hero.backgroundImage?.asset)?.url();
  const aboutImageUrl = urlFor(about.image?.asset)?.url();
  const primaryCtaImageUrl = primaryCta?.backgroundImage ? urlFor(primaryCta.backgroundImage?.asset)?.url() : null;
  const secondaryCtaImageUrl = secondaryCta?.backgroundImage ? urlFor(secondaryCta.backgroundImage?.asset)?.url() : null;

  return (
    <main className="min-h-screen">
      {/* Hidden form for Netlify - Needs businessInfo for fields if used */}
      <form name="contact" netlify="true" netlify-honeypot="bot-field" hidden>
        <input type="text" name="name" />
        <input type="email" name="email" />
        <input type="tel" name="phone" />
        <textarea name="message"></textarea>
      </form>

      {/* Top Bar - Uses businessInfo */}
      {businessInfo.name && (
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-2 px-4 fixed w-full z-50">
          <div className="container mx-auto flex justify-between items-center">
            <span className="font-bold">{businessInfo.name}</span>
            <div className="flex space-x-4">
              {businessInfo.phone && <a href={`tel:${businessInfo.phone}`} className="hover:text-blue-300 text-sm">{businessInfo.phone}</a>}
              {businessInfo.email && <a href={`mailto:${businessInfo.email}`} className="hover:text-blue-300 text-sm">{businessInfo.email}</a>}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed Top Bar - only if Top Bar is visible */}
      {businessInfo.name && <div className="h-10"></div>}

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
                  <a href={`tel:${businessInfo.phone}`} className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors duration-300">
                    Call Now
                  </a>
                )}
              </div>
              {hero.formTitle && (
                <div className="flex justify-center md:justify-end">
                  {/* Temporarily comment out onSubmit to diagnose build error */}
                  <form name="contact" method="POST" netlify="true" netlify-honeypot="bot-field" /* onSubmit={handleSubmit} */ className="w-full max-w-md bg-white/10 backdrop-blur-sm p-8 rounded-lg">
                    <input type="hidden" name="form-name" value="contact" />
                    <p hidden><label>Don't fill this out if you're human: <input name="bot-field" /></label></p>
                    <h2 className="text-2xl font-semibold mb-6 text-white">{hero.formTitle}</h2>
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your Name"
                        required
                        className="w-full px-4 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Your Email"
                        required
                        className="w-full px-4 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Your Phone"
                        required
                        className="w-full px-4 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Your Message"
                        required
                        rows="4"
                        className="w-full px-4 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                      ></textarea>
                    </div>
                    <button type="submit" className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Send Message
                    </button>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mainFeatures.map((feature) => {
                // Pass feature.image.asset to urlFor
                const featureImageUrl = urlFor(feature.image?.asset)?.url();
                const key = feature._key || feature._id;
                return (
                  <div key={key} className="group bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
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
              })}
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

      {/* Primary CTA Block - uses primaryCta */}
      {primaryCta.title && (
        <section className="py-16 relative overflow-hidden">
          {primaryCtaImageUrl && (
            <div className="absolute inset-0">
              <Image src={primaryCtaImageUrl} alt={primaryCta.backgroundImage?.alt || primaryCta.title || 'CTA Background'} fill className="object-cover" />
              <div className="absolute inset-0 bg-blue-600 bg-opacity-90"></div>
            </div>
          )}
          <div className="container mx-auto px-4 text-center relative z-10 text-white">
            <h2 className="text-3xl font-bold mb-4">{primaryCta.title}</h2>
            {primaryCta.subtitle && <p className="mb-8">{primaryCta.subtitle}</p>}
            {primaryCta.buttonText && (
              <button onClick={scrollToTop} className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors duration-300">
                {primaryCta.buttonText}
              </button>
            )}
          </div>
        </section>
      )}

      {/* Secondary Feature Cards */}
      {secondaryFeatures.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {secondaryFeatures.map((feature) => {
                const featureImageUrl = urlFor(feature.image?.asset)?.url();
                const key = feature._key || feature._id;
                return (
                  <div key={key} className="group bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
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
              })}
            </div>
          </div>
        </section>
      )}

      {/* Secondary Parallax CTA - uses secondaryCta */}
      {secondaryCta.title && (
        <section className="py-16 relative overflow-hidden">
          {secondaryCtaImageUrl && (
            <div className="absolute inset-0">
              <Image src={secondaryCtaImageUrl} alt={secondaryCta.backgroundImage?.alt || secondaryCta.title || 'Secondary CTA Background'} fill className="object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-70"></div>
            </div>
          )}
          <div className="container mx-auto px-4 text-center relative z-10 text-white">
            <h2 className="text-3xl font-bold mb-4">{secondaryCta.title}</h2>
            {secondaryCta.subtitle && <p className="mb-8">{secondaryCta.subtitle}</p>}
            {secondaryCta.buttonText && (
              <button onClick={scrollToTop} className="bg-white text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-300">
                {secondaryCta.buttonText}
              </button>
            )}
          </div>
        </section>
      )}

      {/* Contact Section - uses businessInfo, map */}
      {(businessInfo.phone || businessInfo.email || businessInfo.address || map?.embedUrl) && (
        <section className="py-16 bg-gradient-to-br from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
                <div className="space-y-4">
                  {businessInfo.phone && <p><strong>Phone:</strong> <a href={`tel:${businessInfo.phone}`} className="text-blue-600 hover:underline">{businessInfo.phone}</a></p>}
                  {businessInfo.email && <p><strong>Email:</strong> <a href={`mailto:${businessInfo.email}`} className="text-blue-600 hover:underline">{businessInfo.email}</a></p>}
                  {businessInfo.address && <p><strong>Address:</strong> {businessInfo.address}</p>}
                  {businessInfo.hoursOfOperation && <p><strong>Hours:</strong> <span className="whitespace-pre-line">{businessInfo.hoursOfOperation}</span></p>}
                </div>
                <button onClick={scrollToTop} className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300">
                  Contact Us Form
                </button>
              </div>
              {map?.embedUrl && (
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
        <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            {businessInfo.name && <h3 className="text-xl font-bold mb-4">{businessInfo.name}</h3>}
            {businessInfo.address && <p className="mb-2 text-gray-400">{businessInfo.address}</p>}
            <div className="flex justify-center space-x-4 mb-4">
              {businessInfo.phone && <a href={`tel:${businessInfo.phone}`} className="hover:text-blue-300">{businessInfo.phone}</a>}
              {businessInfo.email && <a href={`mailto:${businessInfo.email}`} className="hover:text-blue-300">{businessInfo.email}</a>}
            </div>
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} {businessInfo.name || 'Your Company'}. All rights reserved.</p>
          </div>
        </footer>
      )}
    </main>
  );
} 