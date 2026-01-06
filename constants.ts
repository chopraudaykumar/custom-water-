import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Custom Label 1L Box',
    description: '12 premium 1L bottles with custom branding options.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1616118132534-381148898bb4?auto=format&fit=crop&w=500&q=80',
    volume: '1L x 12 Bottles',
    popular: true,
  },
  {
    id: 'p2',
    name: 'Custom Label 500ml Box',
    description: '24 compact 500ml bottles with custom labels. Perfect for events.',
    price: 140,
    image: 'https://images.unsplash.com/photo-1602143407151-11115cdbf69c?auto=format&fit=crop&w=500&q=80',
    volume: '500ml x 24 Bottles',
    popular: true,
  },
  {
    id: 'p3',
    name: 'Shuddhneer Alkaline',
    description: 'High pH water for better metabolism and health.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1523362628408-3c26bed133af?auto=format&fit=crop&w=500&q=80',
    volume: '1L x 12 Bottles',
  },
  {
    id: 'p4',
    name: 'Shuddhneer 20L Can',
    description: 'Bulk supply for home and office dispensers.',
    price: 90,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80',
    volume: '20L Can',
  },
];