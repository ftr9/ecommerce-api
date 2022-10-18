import { Expose, Exclude } from 'class-transformer';

export class CartResponseGuestDto {
  cart_id: string;

  @Expose({ name: 'product_id' })
  getProductId() {
    return this.product.id;
  }
  @Expose({ name: 'product_name' })
  getProductName() {
    return this.product.name;
  }
  @Expose({ name: 'product_price' })
  getProductPrice() {
    return this.product.price;
  }
  @Expose({ name: 'product_inStock' })
  getProductInStock() {
    return this.product.inStock;
  }
  @Expose({ name: 'product_category' })
  getProductCategory() {
    return this.product.category;
  }
  @Expose({ name: 'product_image' })
  getProductImage() {
    return this.product.image;
  }

  @Exclude()
  product: {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
    category: string;
    image: string;
  };

  constructor(partial: Partial<CartResponseGuestDto>) {
    Object.assign(this, partial);
  }
}

//Authctd = 'authenticated'
export class CartResponseAuthctdDto {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  @Expose({ name: 'product_name' })
  getProductName() {
    return this.product.name;
  }
  @Expose({ name: 'product_price' })
  getProductPrice() {
    return this.product.price;
  }
  @Expose({ name: 'product_inStock' })
  getProductInStock() {
    return this.product.inStock;
  }
  @Expose({ name: 'product_category' })
  getProductCategory() {
    return this.product.category;
  }
  @Exclude()
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    inStock: boolean;
    category: string;
  };

  constructor(partial: Partial<CartResponseAuthctdDto>) {
    Object.assign(this, partial);
  }
}
