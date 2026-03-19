export const STATS = [
  { label: 'Total Revenue', value: '$48,295', change: '+12.5%', up: true, color: 'bg-indigo-50 text-indigo-600', dot: 'bg-indigo-500' },
  { label: 'Total Orders', value: '1,284', change: '+8.2%', up: true, color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' },
  { label: 'Total Products', value: '342', change: '+3.1%', up: true, color: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500' },
  { label: 'Total Users', value: '8,741', change: '-1.4%', up: false, color: 'bg-rose-50 text-rose-600', dot: 'bg-rose-500' },
];

export const PRODUCTS = [
  { id: 1, name: 'Nothing Phone 1', category: 'Electronics', price: '$800', stock: 24, status: 'In Stock', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=60&h=60&fit=crop' },
  { id: 2, name: 'Samsung Galaxy S24', category: 'Electronics', price: '$900', stock: 12, status: 'In Stock', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=60&h=60&fit=crop' },
  { id: 3, name: 'Nike Air Max 270', category: 'Fashion', price: '$120', stock: 0, status: 'Out of Stock', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop' },
  { id: 4, name: 'Apple MacBook Air M2', category: 'Electronics', price: '$1100', stock: 8, status: 'In Stock', img: 'https://images.unsplash.com/photo-1611186871525-a3c8a7a8f5c1?w=60&h=60&fit=crop' },
  { id: 5, name: 'Sony WH-1000XM5', category: 'Electronics', price: '$280', stock: 3, status: 'Low Stock', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop' },
  { id: 6, name: 'Dyson Airwrap', category: 'Beauty', price: '$500', stock: 15, status: 'In Stock', img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=60&h=60&fit=crop' },
];

export const ORDERS = [
  { id: '#ORD-001', customer: 'Rahim Ahmed', date: 'Mar 12, 2025', total: '$1,280', status: 'Delivered', items: 3 },
  { id: '#ORD-002', customer: 'Karim Hassan', date: 'Mar 13, 2025', total: '$450', status: 'Processing', items: 2 },
  { id: '#ORD-003', customer: 'Nadia Islam', date: 'Mar 14, 2025', total: '$89', status: 'Pending', items: 1 },
  { id: '#ORD-004', customer: 'Sumon Roy', date: 'Mar 14, 2025', total: '$2,100', status: 'Shipped', items: 4 },
  { id: '#ORD-005', customer: 'Fatema Begum', date: 'Mar 15, 2025', total: '$320', status: 'Cancelled', items: 2 },
];

export const CATEGORIES = [
  { id: 1, name: 'Electronics', products: 120, img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=60&h=60&fit=crop' },
  { id: 2, name: 'Fashion', products: 85, img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=60&h=60&fit=crop' },
  { id: 3, name: 'Home & Kitchen', products: 64, img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=60&h=60&fit=crop' },
  { id: 4, name: 'Beauty', products: 43, img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=60&h=60&fit=crop' },
  { id: 5, name: 'Sports', products: 30, img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=60&h=60&fit=crop' },
];

export const SLIDES = [
  { id: 1, badge: '🚀 New Arrivals', title: 'Innovation at Your Fingertips', subtitle: 'Premium Electronics', link: '/products', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=120&h=60&fit=crop' },
  { id: 2, badge: '🔥 Best Sellers', title: 'Next-Gen Smart Home', subtitle: 'Automation & AI', link: '/smart-home', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120&h=60&fit=crop' },
];

export const RECENT_ORDERS = ORDERS.slice(0, 4);