// Shared TypeScript contracts for the Trippin' app.
// Every cross-layer data shape lives here. Do not redefine these elsewhere.

export interface AuthUser {
  id: string;
  email: string;
}

export interface TripRequest {
  sentence: string;
}

export interface FlightOption {
  airline: string;
  flightNumber: string;
  departure: string; // ISO datetime
  arrival: string;   // ISO datetime
  origin: string;
  destination: string;
  durationMinutes: number;
  price: number;
  currency: string;
  cabinClass: string;
}

export interface HotelOption {
  name: string;
  starRating: number;
  pricePerNight: number;
  currency: string;
  address: string;
  checkIn: string;
  checkOut: string;
}

export interface WeatherDay {
  date: string;
  condition: string;
  tempHighC: number;
  tempLowC: number;
}

export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  activities: string[];
}

export interface TripReport {
  query: string;
  origin: string;
  destination: string;
  date: string;
  returnDate?: string;
  travelers?: number;
  flights: FlightOption[];
  hotels: HotelOption[];
  weather: WeatherDay[];
  itinerary: ItineraryDay[];
  budgetSummaryINR?: number;
  notes?: string;
  errors?: string[];
}

export type TripUIState =
  | "idle"
  | "submitting"
  | "loading_animation"
  | "result_ready"
  | "error";
