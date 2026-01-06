import { Order, OrderStatus, Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';

// Initialize some mock orders if empty
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-7829',
    customerId: 'user1',
    customerName: 'Rahul Sharma',
    items: [{ productId: 'p1', quantity: 5, productName: 'Custom Label 1L Box', price: 120 }],
    totalAmount: 600,
    status: OrderStatus.DISPATCHED,
    date: new Date(Date.now() - 86400000).toISOString(),
    address: '123, Palm Grove Heights, Mumbai',
  },
  {
    id: 'ORD-9921',
    customerId: 'user2',
    customerName: 'Anita Desai',
    items: [{ productId: 'p3', quantity: 1, productName: 'Shuddhneer Alkaline', price: 450 }],
    totalAmount: 450,
    status: OrderStatus.PENDING,
    date: new Date().toISOString(),
    address: '45, Green Park, Delhi',
  }
];

class MockBackendService {
  private orders: Order[] = INITIAL_ORDERS;

  getProducts(): Product[] {
    return MOCK_PRODUCTS;
  }

  getOrders(): Order[] {
    return [...this.orders];
  }

  getUserOrders(userId: string): Order[] {
    return this.orders.filter(o => o.customerId === userId);
  }

  placeOrder(order: Omit<Order, 'id' | 'status' | 'date'>): Order {
    const newOrder: Order = {
      ...order,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      status: OrderStatus.PENDING,
      date: new Date().toISOString(),
    };
    this.orders.unshift(newOrder); // Add to top
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
    }
  }

  updateOrder(updatedOrder: Order): void {
    const index = this.orders.findIndex(o => o.id === updatedOrder.id);
    if (index !== -1) {
      this.orders[index] = updatedOrder;
    }
  }

  // Helper for CRM stats
  getStats() {
    const totalOrders = this.orders.length;
    const totalRevenue = this.orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const pendingOrders = this.orders.filter(o => o.status === OrderStatus.PENDING).length;
    return { totalOrders, totalRevenue, pendingOrders };
  }
}

export const backend = new MockBackendService();