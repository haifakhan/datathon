export interface FoodBank {
  id: string;
  name: string;
  address: string;
  city: string;
  description: string;
  phone: string;
  latitude: number;
  longitude: number;
  needs: string[];
  hours: string;
}

export interface InsecurityData {
  region: string;
  percent: number;
  latitude: number;
  longitude: number;
  trend: 'Higher' | 'Lower' | 'Stable' | 'N/A';
}

export interface DonationPost {
  id: string;
  vendorName: string;
  foodType: string;
  quantity: string;
  expiry: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  status: 'available' | 'claimed';
  targetCommunity?: string; // The high-need area this helps
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  MAP = 'MAP',
  ANALYTICS = 'ANALYTICS',
  AI_ASSISTANT = 'AI_ASSISTANT'
}

export enum UserType {
  VENDOR = 'VENDOR',
  CHARITY = 'CHARITY'
}