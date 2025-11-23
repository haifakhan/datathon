import phuPercentageCsv from './data/ontario_phu_percentage1.csv?raw';
import cleanFoodBanksCsv from './data/clean_food_banks.csv?raw';

const parseCsvLine = (line: string): string[] => {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }

  cells.push(current.trim());
  return cells.map((cell) => cell.replace(/^"|"$/g, '').trim());
};

const deriveCity = (address: string) => {
  const parts = address.split(',').map((p) => p.trim()).filter(Boolean);
  return parts[parts.length - 3] || parts[parts.length - 2] || parts[0] || 'Ontario';
};

const defaultNeedSets = [
  ['Canned goods', 'Dry staples', 'Hygiene kits'],
  ['Fresh produce', 'Baby items', 'Protein'],
  ['Ready meals', 'Snacks', 'Water']
];

export const FOOD_BANKS: FoodBank[] = cleanFoodBanksCsv
  .trim()
  .split(/\r?\n/)
  .slice(1) // drop header
  .map((line, idx) => {
    const [name, address = 'Address not provided', latStr, lngStr] = parseCsvLine(line);
    const latitude = parseFloat(latStr);
    const longitude = parseFloat(lngStr);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return null;
    }

    const needs = defaultNeedSets[idx % defaultNeedSets.length];

    return {
      id: `bank-${idx}`,
      name: name || 'Food Bank',
      address,
      city: deriveCity(address),
      description: 'Community food bank',
      phone: 'N/A',
      latitude,
      longitude,
      needs,
      hours: 'Call for hours'
    } as FoodBank;
  })
  .filter((bank): bank is FoodBank => Boolean(bank));

const splitCsvLine = (line: string) => line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(cell => cell.replace(/^"|"$/g, '').trim());

const parseInsecurityCsv = (csv: string): InsecurityData[] => {
  const lines = csv.trim().split(/\r?\n/).filter(Boolean);
  // Drop optional first title line if it is not a CSV row
  if (lines.length && !lines[0].includes(',')) {
    lines.shift();
  }
  // Drop header
  if (lines.length) {
    lines.shift();
  }

  return lines
    .map((line) => {
      const [region, percentStr, latStr, lngStr] = splitCsvLine(line);
      const percent = parseFloat(percentStr);
      const latitude = parseFloat(latStr);
      const longitude = parseFloat(lngStr);
      if ([percent, latitude, longitude].some((n) => Number.isNaN(n))) {
        return null;
      }
      return {
        region,
        percent,
        latitude,
        longitude,
        trend: 'N/A' as const
      };
    })
    .filter((entry): entry is InsecurityData => Boolean(entry));
};

export const INSECURITY_STATS: InsecurityData[] = parseInsecurityCsv(phuPercentageCsv);

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
