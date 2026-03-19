
export interface ProductCategory {
    id: number;
    name: string;
}

export interface Inventory {
  stock: number;
}


interface Product {
  id: string;
  name: string;
  image: string;
  categories: ProductCategory[];
  originalPrice: string;
  price: string;
  inventory: Inventory;
}


export type ProductsResponse = Product[];


export interface AddProductModalProps {
    open: boolean;
    isPending: boolean;
    onClose: () => void;
    onSubmit: (data: ProductFormData) => void;
}

export interface ProductFormData {
    name: string;
    description: string;
    categoryId: string[] | null; 
    originalPrice: string;
    price: string;
    stock: number;
    thumbnail: File | null;
    images: File[];
    existingImageUrls?: string[]; 
}



export interface Category {
  id: string;
  name: string;
  createdAt?: string;
  image: string;
  productCount:number
}


export type CategoriesResponse = Category[];