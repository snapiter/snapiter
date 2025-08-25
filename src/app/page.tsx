import MapView from '@/components/MapView';
import SlidingPanel from '@/components/SlidingPanel';
import TripDetails from '@/components/TripDetails';

const mockTrip = {
  id: '1',
  title: 'Mediterranean Adventure',
  description: 'A beautiful journey through the Mediterranean Sea, exploring hidden coves and ancient harbors. The weather was perfect and the views were absolutely stunning.',
  startDate: 'Aug 15, 2024',
  endDate: 'Aug 25, 2024',
  distance: '1,247 nautical miles',
  photos: [
    {
      id: '1',
      url: '/next.svg',
      alt: 'Sunset at sea',
      caption: 'Beautiful sunset on day 3 of our journey'
    },
    {
      id: '2', 
      url: '/vercel.svg',
      alt: 'Harbor view',
      caption: 'Arriving at the historic harbor'
    },
    {
      id: '3',
      url: '/next.svg', 
      alt: 'Calm waters',
      caption: 'Perfect sailing conditions'
    }
  ]
};

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Mobile Layout */}
      <div className="md:hidden h-full">
        <MapView className="absolute inset-0" />
        <SlidingPanel>
          <TripDetails trip={mockTrip} />
        </SlidingPanel>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-full">
        <div className="flex-1 relative">
          <MapView className="h-full" />
        </div>
        <div className="w-96 bg-white shadow-xl overflow-hidden">
          <div className="p-6 h-full">
            <TripDetails trip={mockTrip} />
          </div>
        </div>
      </div>
    </div>
  );
}
