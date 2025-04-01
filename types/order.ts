export interface IOrder {
  _id: string;
  orderId: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: {
    _id: string;
    _user: string;
    items: {
      _id: string;
      name: string;
      quantity: number;
      originalPrice: number;
      price: number;
      image: string;
      discount?: {
        active: boolean;
        value: number;
      };
    }[];
    price: number;
    originalPrice: number;
  };
  status: "pending" | "active" | "delivered" | "cancelled";
  shippingAddress: {
    _id: string;
    city: string;
    country: string;
    name: { first: string; last: string };
    phone: string;
    postalCode?: string;
    region: string;
    type: "home" | "office";
    details: string;
  };
  payment: {
    method: "online" | "cod";
    status: "pending" | "success";
  };
  price: {
    total: number;
    shipping: number;
    discount: number;
    tax: number;
  };
}
