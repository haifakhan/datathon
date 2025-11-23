// Haversine formula to calculate distance between two points
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Simple mapping of PHU names to rough coordinates for the heatmap simulation
export const getPHUCoordinates = (phuName: string): { lat: number, lng: number } => {
  const mapping: Record<string, { lat: number, lng: number }> = {
    "Algoma Public Health": { lat: 46.5136, lng: -84.3358 },
    "Brant County Health Unit": { lat: 43.1414, lng: -80.2632 },
    "Chatham-Kent Public Health": { lat: 42.4048, lng: -82.1910 },
    "City of Hamilton Public Health Services": { lat: 43.2557, lng: -79.8711 },
    "Durham Region Health Department": { lat: 43.8971, lng: -78.8658 },
    "Eastern Ontario Health Unit": { lat: 45.0213, lng: -74.7303 },
    "Grey Bruce Public Health": { lat: 44.5690, lng: -80.9406 },
    "Haldimand-Norfolk Health Unit": { lat: 42.8387, lng: -80.3070 },
    "Haliburton Kawartha Northumberland Peterborough": { lat: 44.3, lng: -78.3 },
    "Halton Region Public Health": { lat: 43.5183, lng: -79.8774 },
    "Hastings Prince Edward Public Health": { lat: 44.1628, lng: -77.3832 },
    "Huron Perth Public Health": { lat: 43.55, lng: -81.0 },
    "Kingston, Frontenac and Lennox & Addington": { lat: 44.2312, lng: -76.4860 },
    "Lambton Public Health": { lat: 42.9745, lng: -82.4066 },
    "Leeds, Grenville & Lanark District": { lat: 44.6, lng: -76.0 },
    "Middlesex-London Health Unit": { lat: 42.9849, lng: -81.2453 },
    "Niagara Region Public Health": { lat: 43.06, lng: -79.1 },
    "North Bay Parry Sound District": { lat: 46.3091, lng: -79.4608 },
    "Northwestern Health Unit": { lat: 49.7670, lng: -94.4920 },
    "Ottawa Public Health": { lat: 45.4215, lng: -75.6972 },
    "Peel Public Health": { lat: 43.65, lng: -79.75 },
    "Peterborough Public Health": { lat: 44.3091, lng: -78.3197 },
    "Porcupine Health Unit": { lat: 48.4758, lng: -81.3305 },
    "Public Health Sudbury & Districts": { lat: 46.49, lng: -81.01 },
    "Region of Waterloo Public Health": { lat: 43.45, lng: -80.48 },
    "Renfrew County and District Health Unit": { lat: 45.82, lng: -77.11 },
    "Simcoe Muskoka District Health Unit": { lat: 44.4, lng: -79.7 },
    "Southwestern Public Health": { lat: 42.78, lng: -81.18 },
    "Thunder Bay District Health Unit": { lat: 48.3809, lng: -89.2477 },
    "Timiskaming Health Unit": { lat: 47.51, lng: -79.68 },
    "Toronto Public Health": { lat: 43.70, lng: -79.42 },
    "Wellington-Dufferin-Guelph Public Health": { lat: 43.5448, lng: -80.2482 },
    "Windsor-Essex County Health Unit": { lat: 42.3149, lng: -83.0477 },
    "York Region Public Health": { lat: 44.0, lng: -79.45 }
  };
  
  return mapping[phuName] || { lat: 43.7, lng: -79.4 }; // Default to GTA
};