import React, { createContext, useState, useContext } from 'react';

// Define order item type
interface OrderItem {
  name: string;
  price: string;
  image: any;
  quantity: number;
}

// Define order type
export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: number;
  total: string;
  status: string;
  statusColor: string;
  image: string;
  products?: OrderItem[];
}

// Define the context type
type OrderContextType = {
  orders: Order[];
  addOrder: (cartItems: OrderItem[], total: string) => void;
  getOrders: () => Order[];
};

// Create the context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Provider component
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Add a new order
  const addOrder = (cartItems: OrderItem[], total: string) => {
    // Format date for order
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    // Create order number with random component
    const orderNumber = `#ORD-${currentDate.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Create image from first product or default
    const image = cartItems.length > 0 && cartItems[0].image 
      ? (typeof cartItems[0].image === 'string' ? cartItems[0].image : 'https://placehold.co/60x60/png?text=Order')
      : 'https://placehold.co/60x60/png?text=Order';
    
    // Calculate total items
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Create new order
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      date: formattedDate,
      items: totalItems,
      total,
      status: 'Processing',
      statusColor: '#2196f3',
      image,
      products: cartItems
    };
    
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    return newOrder;
  };
  
  // Get all orders
  const getOrders = () => {
    return orders;
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      addOrder, 
      getOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use the order context
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
