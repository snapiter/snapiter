import MapView from '@/components/MapView';
import SlidingPanel from '@/components/SlidingPanel';
import TripSwiper from '@/components/TripSwiper';

const mockTrips = [
  {
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
  },
  {
    id: '2',
    title: 'Atlantic Crossing',
    description: 'An epic 15-day crossing of the Atlantic Ocean. Encountered dolphins, amazing sunrises, and the challenge of ocean sailing at its finest.',
    startDate: 'Sep 1, 2024',
    endDate: 'Sep 16, 2024',
    distance: '3,100 nautical miles',
    photos: [
      {
        id: '4',
        url: '/globe.svg',
        alt: 'Ocean waves',
        caption: 'Massive waves on day 8'
      },
      {
        id: '5',
        url: '/next.svg',
        alt: 'Dolphins',
        caption: 'Pod of dolphins joined us for hours'
      }
    ]
  },
  {
    id: '3',
    title: 'Caribbean Island Hopping',
    description: 'Two weeks exploring the beautiful Caribbean islands, from crystal clear waters to vibrant coral reefs and tropical beaches.',
    startDate: 'Oct 5, 2024',
    endDate: 'Oct 19, 2024',
    distance: '890 nautical miles',
    photos: [
      {
        id: '6',
        url: '/vercel.svg',
        alt: 'Tropical beach',
        caption: 'Perfect white sand beach in Barbados'
      },
      {
        id: '7',
        url: '/window.svg',
        alt: 'Coral reef',
        caption: 'Snorkeling at the coral reef'
      },
      {
        id: '8',
        url: '/file.svg',
        alt: 'Sunset',
        caption: 'Caribbean sunset from the deck'
      }
    ]
  }
];

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Mobile Layout */}
      <div className="md:hidden h-full">
        <MapView className="absolute inset-0" />
        <SlidingPanel>
          <TripSwiper trips={mockTrips} />
        </SlidingPanel>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-full">
        <div className="flex-1 relative">
          <MapView className="h-full" />
        </div>
        <div className="w-96 bg-white shadow-xl overflow-hidden">
          <div className="p-6 h-full">
            <TripSwiper trips={mockTrips} />
          </div>
        </div>
      </div>
    </div>
  );
}
