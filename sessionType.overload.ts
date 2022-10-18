import session from 'express-session';

export = session;
interface CartType {
  cart_id: string;
  product: {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
    category: string;
    quantity: number;
    total_price: number;
    image: string;
  };
}

declare module 'express-session' {
  interface SessionData {
    carts: CartType[];
  }
}
