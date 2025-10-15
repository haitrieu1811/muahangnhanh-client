import { generateNameId } from '@/lib/utils'

const PATH = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCTS_DETAIL: (data: { name: string; id: string }) => `/products/${generateNameId(data)}`,
  CART: '/cart',
  CART_ORDER_INFO: '/cart/order-info',
  CART_ORDER_PREVIEW: '/cart/order-preview',
  CART_CHECKOUT_SUCCESS: '/cart/checkout-success',
  BLOGS: '/blogs',
  BLOGS_DETAIL: (data: { name: string; id: string }) => `/blogs/${generateNameId(data)}`,

  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  FORGOT_RESET_PASSWORD: '/auth/reset-password',

  REFRESH_TOKEN: '/redirect/refresh-token',

  ACCOUNT: '/account',
  ACCOUNT_ADDRESSES: '/account/addresses',
  ACCOUNT_ORDERS: '/account/orders',
  ACCOUNT_CHANGE_PASSWORD: '/account/change-password',
  ACCOUNT_ORDERS_DETAIL: (id: string) => `/account/orders/${id}`,

  ADMIN: '/admin',
  ADMIN_ME: '/admin/me',
  ADMIN_IMAGES: '/admin/images',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCTS_NEW: '/admin/products/new',
  ADMIN_PRODUCTS_DETAIL: (id: string) => `/admin/products/${id}`,
  ADMIN_PRODUCT_CATEGORIES: '/admin/product-categories',
  ADMIN_BLOGS: '/admin/blogs',
  ADMIN_BLOGS_NEW: '/admin/blogs/new',
  ADMIN_BLOGS_DETAIL: (id: string) => `/admin/blogs/${id}`,
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ORDERS_DETAIL: (id: string) => `/admin/orders/${id}`
} as const

export default PATH
