interface ImageType {
  url: string;
}

export interface productBodyType {
  name: string;
  description: string;
  price: number;
  category: string;
  images: ImageType[];
}

export interface QueryParamType {
  price?: {
    lte?: number;
    gte?: number;
    lt?: number;
    gt?: number;
  };
  limit?: number;
  skip?: number;
  category?: string;
}

export interface ProductResponseBodyTypeId {
  id: number;
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  category: string;
  images: ImageType[];
}

export interface UpdateBodyType {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
}
