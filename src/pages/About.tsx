import { Car, Shield, Wrench, Users } from 'lucide-react';

export function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Anything Cars</h1>
          <p className="text-xl text-gray-600">
            Your one-stop destination for all automotive needs in Nigeria
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <p>
            Anything Cars is Nigeria's premier automotive platform, offering a comprehensive
            suite of services designed to meet all your car-related needs. Whether you're
            looking to hire a car, buy a vehicle, or source auto parts, we've got you covered.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Car className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Car Hire Service</h3>
              <p className="text-gray-600">
                Choose from our fleet of 2007+ vehicles, all coming with professional
                drivers. Options include point-to-point drops and daily hires (12-hour blocks).
                Add security escort services for enhanced safety.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Car Marketplace</h3>
              <p className="text-gray-600">
                Buy and sell vehicles through our secure marketplace. Each listing
                is verified, and we facilitate safe transactions between buyers and sellers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <Wrench className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Auto Parts Market</h3>
              <p className="text-gray-600">
                Find genuine auto parts from trusted sellers. Our parts compatibility
                checker ensures you get the right components for your vehicle.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Security Services</h3>
              <p className="text-gray-600">
                Optional security escort services available at ₦30,000 per day (12 hours),
                providing professional protection for your journey.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Create an Account:</strong> Sign up using your email or phone
              number, or connect with Google.
            </li>
            <li>
              <strong>Choose Your Service:</strong> Select from car hire, marketplace
              purchases, or auto parts shopping.
            </li>
            <li>
              <strong>Make Secure Payments:</strong> Use our multiple payment options
              including cards, bank transfers, and digital wallets.
            </li>
            <li>
              <strong>Enjoy Premium Service:</strong> Experience professional
              drivers, verified sellers, and quality assurance on all services.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}