const PATH = {
  HOME: '/',

  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',

  ACCOUNT: '/account',
  ACCOUNT_ADDRESSES: '/account/addresses',
  ACCOUNT_ORDERS: '/account/orders',
  ACCOUNT_CHANGE_PASSWORD: '/account/change-password',

  ADMIN: '/admin',
  ADMIN_ME: '/admin/me',
  ADMIN_IMAGES: '/admin/images',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCTS_NEW: '/admin/products/new',
  ADMIN_PRODUCTS_DETAIL: (id: string) => `/admin/products/${id}`,
  ADMIN_PRODUCT_CATEGORIES: '/admin/product-categories',
  ADMIN_BLOGS: '/admin/blogs',
  ADMIN_BLOGS_NEW: '/admin/blogs/new',
  ADMIN_BLOGS_DETAIL: (id: string) => `/admin/blogs/${id}`
} as const

export default PATH
