import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80"
            alt="Luxury Car"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6">
              Your Journey, Your Style
            </h1>
            <p className="text-xl mb-8">
              Experience luxury and convenience with our premium car services.
              Whether you're hiring, buying, or need parts - we've got you covered.
            </p>
            <div className="flex gap-4">
              <Link to="/vehicles">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Hire a Car
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Browse Cars for Sale
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the component remains the same */}
    </div>
  );
}