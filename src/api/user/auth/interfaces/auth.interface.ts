export interface signUpBodyType {
  name: string;
  email: string;
  phone: string;
  postcode: number;
  address_district: string;
  address_municipality: string;
  address_ward: number;
  password: string;
}

export interface signInBodyType {
  email: string;
  password: string;
}
