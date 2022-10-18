export interface placeOrderBodyType {
  shipToDifferentAddress: boolean;
  shippingInfo?: {
    name: string;
    phone: string;
    email: string;
    postCode: number;
    address_district: string;
    address_municipality: string;
    address_ward: number;
  };
  userInfo?: {
    name: string;
    email: string;
    phone: string;
    postcode: number;
    address_district: string;
    address_municipality: string;
    address_ward: number;
    password: string;
  };
}
