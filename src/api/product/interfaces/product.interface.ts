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

export interface ProductResponseInfoType {
  status: string;
  message: string;
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
  categories: string;
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

export interface ProductResponseBodyType {
  id: number;
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  category: string;
  images: ImageType;
}

export interface UpdateBodyType {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
}
