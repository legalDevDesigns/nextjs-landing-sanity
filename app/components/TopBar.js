export default function TopBar({ businessName, phoneNumber }) {
  return (
    <div className="bg-gray-800 text-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-xl font-bold">{businessName}</div>
        <div className="flex items-center">
          <a href={`tel:${phoneNumber}`} className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {phoneNumber}
          </a>
        </div>
      </div>
    </div>
  )
} 