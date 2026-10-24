export interface DishVariant {
  name: string; // e.g. 'Half', 'Full', 'Small', 'Medium', 'Large', 'Chatni', 'Mayo'
  price: number; // in PKR
}

export type MenuCategory =
  | 'Desi Items'
  | 'Karahi'
  | 'BBQ & Grills'
  | 'Mirchi 360 Rolls'
  | 'Burgers & Sandwiches'
  | 'Pizza'
  | 'Chinese & Pasta'
  | 'Vegetable & Paneer'
  | 'Fish & Appetizers'
  | 'Paratha, Naan & Salads'
  | 'Desserts & Ice Cream'
  | 'Fresh Juices, Shakes & Beverages'
  | 'Special Deals';

export interface MenuItem {
  id: string;
  itemNumber: number; // 1 to 194
  name: string;
  category: MenuCategory;
  description: string;
  price: number; // base price or primary rate in PKR
  variants?: DishVariant[]; // Half/Full, Small/Medium/Large, Chatni/Mayo
  image: string;
  inStock?: boolean; // default true
  rating?: number;
  reviewsCount?: number;
  tags?: string[];
  isSpecial?: boolean;
}

export interface CartItem {
  id: string; // unique cart entry ID
  menuItemId: string;
  name: string;
  category: string;
  image: string;
  selectedVariant?: string; // e.g. 'Half', 'Full', 'Large', etc.
  price: number; // unit price for this variant
  quantity: number;
  specialInstructions?: string;
}

export type OrderStatus = 'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export interface ActiveOrder {
  orderId: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  estimatedMinutes: number;
  placedAt: string;
  address: string;
  riderName: string;
  riderVehicle: string;
  customerName?: string;
  customerPhone?: string;
}

export interface PastOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Delivered' | 'In Progress' | 'Cancelled';
  items: CartItem[];
  total: number;
  address?: string;
}
