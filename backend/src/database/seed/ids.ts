export const CATEGORY_IDS = {
  headphones: 'c1000001-0000-4000-8000-000000000001',
  laptops: 'c1000001-0000-4000-8000-000000000002',
  smartphones: 'c1000001-0000-4000-8000-000000000003',
  monitors: 'c1000001-0000-4000-8000-000000000004',
  keyboards: 'c1000001-0000-4000-8000-000000000005',
} as const;

export const GUEST_USER_ID = 'd1000001-0000-4000-8000-000000000001';
export const GUEST_CART_ID = 'e1000001-0000-4000-8000-000000000001';
export const GUEST_EMAIL = 'guest@sift.local';
export const GUEST_NAME = 'Guest';

export function productId(index: number): string {
  return `a1000001-0000-4000-8000-${index.toString(16).padStart(12, '0')}`;
}

export function childId(prefix: 'f1000001' | 'f2000001' | 'f3000001', index: number): string {
  return `${prefix}-0000-4000-8000-${index.toString(16).padStart(12, '0')}`;
}
