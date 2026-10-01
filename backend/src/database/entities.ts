import { Category } from '../modules/categories/infrastructure/persistence/category.entity.js';
import { CartItem } from '../modules/cart/infrastructure/persistence/cart-item.entity.js';
import { Cart } from '../modules/cart/infrastructure/persistence/cart.entity.js';
import { User } from '../modules/cart/infrastructure/persistence/user.entity.js';
import { OrderItem } from '../modules/orders/infrastructure/persistence/order-item.entity.js';
import { Order } from '../modules/orders/infrastructure/persistence/order.entity.js';
import { ProductAttribute } from '../modules/products/infrastructure/persistence/product-attribute.entity.js';
import { ProductFeature } from '../modules/products/infrastructure/persistence/product-feature.entity.js';
import { ProductReviewSummary } from '../modules/products/infrastructure/persistence/product-review-summary.entity.js';
import { Product } from '../modules/products/infrastructure/persistence/product.entity.js';

export const catalogEntities = [
  User,
  Category,
  Product,
  ProductAttribute,
  ProductFeature,
  ProductReviewSummary,
  Cart,
  CartItem,
  Order,
  OrderItem,
];
