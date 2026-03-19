export interface Stat {
  label: string;
  value: string;
  change: string;
  up: boolean;
  color: string;
  dot: string;
}

// export interface Product {
//   id: number;
//   name: string;
//   category: string;
//   price: string;
//   stock: number;
//   status: 'In Stock' | 'Out of Stock' | 'Low Stock';
//   img: string;
// }

export interface Order {
  id: string;
  customer: string;
  date: string;
  total: string;
  status: 'Delivered' | 'Processing' | 'Pending' | 'Shipped' | 'Cancelled';
  items: number;
}

// export interface Category {
//   id: number;
//   name: string;
//   products: number;
//   img: string;
// }

export interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  link: string;
  img: string;
}

export type PageKey = 'dashboard' | 'products' | 'categories' | 'orders' | 'slides' | 'users';

// export type StockStatus = Product['status'];
export type OrderStatus = Order['status'];











//start

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
  createdAt: string;
  image: string;
  productCount:number
}


export type CategoriesResponse = Category[];