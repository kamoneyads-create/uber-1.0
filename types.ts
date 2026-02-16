
export enum AppView {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  VERIFICATION = 'VERIFICATION',
  DASHBOARD = 'DASHBOARD',
  EARNINGS = 'EARNINGS',
  INBOX = 'INBOX',
  PROFILE = 'PROFILE',
  PROFILE_DETAIL = 'PROFILE_DETAIL',
  PUBLIC_PROFILE = 'PUBLIC_PROFILE',
  EDIT_PROFILE = 'EDIT_PROFILE',
  ACCOUNT = 'ACCOUNT',
  DOCUMENTS = 'DOCUMENTS',
  TRIP_DOCUMENTS = 'TRIP_DOCUMENTS',
  VEHICLES = 'VEHICLES'
}

export interface TripRequest {
  id: string;
  passengerName: string;
  rating: number;
  ratingCount: number;
  distanceToPickup: string; // ex: 2.4 km
  timeToPickup: string; // ex: 8 minutos
  tripDistance: string; // ex: 16.3 km
  duration: string; // ex: 33 minutos
  price: number;
  pickup: string;
  destination: string;
  type: 'UberX' | 'Comfort' | 'Black' | 'Moto' | 'Bicicleta' | 'Uber Flash';
}

export interface EarningsData {
  day: string;
  value: number;
}
