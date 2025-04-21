import { urlForImage } from '@/app/sanity/lib/image'

export default function Hero({ title, subtitle, backgroundImage, formTitle }) {
  const imageUrl = backgroundImage ? urlForImage(backgroundImage).url() : '/images/hero-bg.jpg'
  
  return (
    <div className="relative min-h-[600px] flex items-center" style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-xl mb-6">{subtitle}</p>
            <a href="#contact-form" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg inline-block">
              Call Now
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{formTitle}</h2>
            <form id="contact-form" name="contact" method="POST" data-netlify="true" className="space-y-4">
              <input type="hidden" name="form-name" value="contact" />
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="tel" id="phone" name="phone" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea id="message" name="message" rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 