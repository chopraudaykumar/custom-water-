export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  DISPATCHED = 'Dispatched',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  volume: string; // e.g., "1L x 12 Bottles"
  popular?: boolean;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  productName: string;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  date: string;
  address: string;
  trackingCoordinates?: { lat: number; lng: number }; // Mock coordinates for tracking
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Address {
  id: string;
  label: string; // e.g., "Home", "Office"
  value: string; // Full address string
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi';
  label: string; // e.g., "HDFC Visa ending 4242"
  isDefault: boolean;
}