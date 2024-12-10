import { useState } from 'react';
import { Star, MessageSquare, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  response?: string;
}

export function ServiceProviderReviews() {
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      customerName: 'John Doe',
      rating: 5,
      comment: 'Excellent service! The car was in perfect condition and the driver was very professional.',
      date: '2024-03-05'
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      rating: 4,
      comment: 'Good experience overall. Would recommend.',
      date: '2024-03-04',
      response: 'Thank you for your feedback! We appreciate your business.'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'responded'>('all');

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
      />
    ));
  };

  const handleResponse = (reviewId: string) => {
    console.log(`Responding to review with ID: ${reviewId}`);
    // Implement response functionality
  };

  const handleReport = (reviewId: string) => {
    console.log(`Reporting review with ID: ${reviewId}`);
    // Implement report functionality
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Customer Reviews</h2>
          <div className="flex space-x-2">
            <Button
              variant={activeTab === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveTab('all')}
            >
              All Reviews
            </Button>
            <Button
              variant={activeTab === 'pending' ? 'default' : 'outline'}
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </Button>
            <Button
              variant={activeTab === 'responded' ? 'default' : 'outline'}
              onClick={() => setActiveTab('responded')}
            >
              Responded
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{review.customerName}</span>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReport(review.id)}
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="mt-2 text-gray-700">{review.comment}</p>

              {review.response ? (
                <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MessageSquare className="h-4 w-4" />
                    <span>Your Response:</span>
                  </div>
                  <p className="mt-1">{review.response}</p>
                </div>
              ) : (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResponse(review.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Respond to Review
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}