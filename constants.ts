import { FoodBank, InsecurityData, DonationPost } from './types';
import { getPHUCoordinates } from './services/geoUtils';

// Representative sample of Food Banks from File 1
export const SAMPLE_FOOD_BANKS: FoodBank[] = [
  {
    id: "AJP0540",
    name: "St. Paul's on the Hill Community Food Bank",
    address: "1535 Pickering Pkwy, Pickering, ON L1V 7E9",
    city: "Pickering",
    description: "Food bank providing non-perishable items.",
    phone: "905-839-9537",
    latitude: 43.837018,
    longitude: -79.077536,
    needs: ["Canned goods", "Rice", "Pasta"],
    hours: "Tue, Fri 10 am-12 noon"
  },
  {
    id: "AJP0860",
    name: "Salvation Army HOPE Community Services",
    address: "122 Hunt St, Ajax, ON L1S 1P5",
    city: "Ajax",
    description: "Food assistance, Christmas assistance, community meals.",
    phone: "905-427-7123",
    latitude: 43.846598,
    longitude: -79.0245,
    needs: ["Fresh produce", "Bread", "Dairy"],
    hours: "Mon-Thu 10 am-3 pm"
  },
  {
    id: "CEH0447",
    name: "Scarborough Centre for Healthy Communities",
    address: "4100 Lawrence Ave E, Scarborough, ON",
    city: "Scarborough",
    description: "Food and clothing bank.",
    phone: "416-847-4147",
    latitude: 43.766532,
    longitude: -79.19473,
    needs: ["Baby food", "Diapers", "Canned meat"],
    hours: "Wed 12:30-3:30, Thu 2-4:30"
  },
  {
    id: "MET0330",
    name: "Daily Bread Food Bank",
    address: "191 New Toronto St, Toronto, ON M8V 2E7",
    city: "Toronto",
    description: "Distribution hub for network of food banks.",
    phone: "416-203-0050",
    latitude: 43.60647,
    longitude: -79.504047,
    needs: ["Bulk staples", "Warehouse volunteers"],
    hours: "Mon-Fri 8:30 am-4:30 pm"
  },
  {
    id: "MET5516",
    name: "Parkdale Community Food Bank",
    address: "1499 Queen St W, Toronto, ON M6R 1A3",
    city: "Toronto",
    description: "Community food bank with limited advocacy.",
    phone: "416-532-2375",
    latitude: 43.639574,
    longitude: -79.440527,
    needs: ["Vegetables", "Fruits", "Hygiene products"],
    hours: "Wed-Sat 10:30 am-1:30 pm"
  },
  {
    id: "NKT0076",
    name: "Newmarket Food Pantry",
    address: "1251 Gorham St S, Unit 9, Newmarket, ON L3Y 8Y6",
    city: "Newmarket",
    description: "Emergency food pantry service.",
    phone: "905-895-6823",
    latitude: 44.059433,
    longitude: -79.422476,
    needs: ["Toiletries", "Pet food", "Canned fruit"],
    hours: "Mon-Fri 9:30-11:30"
  },
  {
    id: "PEL0458",
    name: "Mississauga Food Bank",
    address: "3121 Universal Dr, Mississauga, ON L4X 2E2",
    city: "Mississauga",
    description: "Central food bank for Mississauga.",
    phone: "905-270-5589",
    latitude: 43.624247,
    longitude: -79.573426,
    needs: ["Nutritious snacks", "Breakfast items"],
    hours: "Mon-Fri 9-5"
  }
];

// Mock data based on File 2 (2024 Annual Household Food Insecurity)
// Using the 'Food insecure (household level)' percentages
const rawStats = [
  { region: "Algoma Public Health", percent: 31.5, trend: "Higher" },
  { region: "City of Hamilton Public Health Services", percent: 29.4, trend: "Higher" },
  { region: "Middlesex-London Health Unit", percent: 31.3, trend: "Higher" },
  { region: "Northeastern Public Health", percent: 32.0, trend: "Higher" },
  { region: "Peel Public Health", percent: 28.0, trend: "Higher" },
  { region: "Toronto Public Health", percent: 24.5, trend: "Higher" },
  { region: "Chatham-Kent Public Health", percent: 27.4, trend: "Stable" },
  { region: "Windsor-Essex County Health Unit", percent: 27.2, trend: "Higher" },
  { region: "Niagara Region Public Health", percent: 25.3, trend: "Stable" },
  { region: "Simcoe Muskoka District Health Unit", percent: 22.6, trend: "Stable" },
  { region: "York Region Public Health", percent: 22.1, trend: "Stable" },
  { region: "Ottawa Public Health", percent: 25.7, trend: "Higher" }
];

export const INSECURITY_STATS: InsecurityData[] = rawStats.map(stat => {
  const coords = getPHUCoordinates(stat.region);
  return {
    region: stat.region,
    percent: stat.percent,
    latitude: coords.lat,
    longitude: coords.lng,
    trend: stat.trend as any
  };
});

export const SAMPLE_POSTS: DonationPost[] = [
  {
    id: '1',
    vendorName: "Joe's Italian Kitchen",
    foodType: "Fresh Pasta & Tomato Sauce",
    quantity: "5kg",
    expiry: "24 hours",
    latitude: 43.6426,
    longitude: -79.3871,
    timestamp: Date.now() - 1000000,
    status: 'available',
    targetCommunity: "Toronto Public Health"
  },
  {
    id: '2',
    vendorName: "Downtown Bakery",
    foodType: "Assorted Bread & Bagels",
    quantity: "20 loaves",
    expiry: "48 hours",
    latitude: 43.6532,
    longitude: -79.3832,
    timestamp: Date.now() - 5000000,
    status: 'claimed',
    targetCommunity: "Toronto Public Health"
  }
];