export type CheckoutProduct = {
  id: string;
  name: string;
  priceCents: number;
  freeShipping: boolean;
  inStock: boolean;
};

export type CheckoutLine = {
  quantity: number;
  product: CheckoutProduct;
};

export type CheckoutCart = {
  id: string;
  items: CheckoutLine[];
};

export type OrderItemDraft = {
  productId: string;
  productName: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
};

export type OrderDraft = {
  shippingName: string;
  shippingAddress: string;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  items: OrderItemDraft[];
};

export type OrderItemRecord = OrderItemDraft & {
  id: string;
};

export type OrderRecord = {
  id: string;
  status: 'placed';
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  shippingName: string;
  shippingAddress: string;
  createdAt: string;
  items: OrderItemRecord[];
};
