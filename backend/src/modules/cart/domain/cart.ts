export type CartProductSnapshot = {
  id: string;
  name: string;
  imageUrl: string;
  priceCents: number;
  freeShipping: boolean;
  inStock: boolean;
};

export type CartLineRecord = {
  id: string;
  quantity: number;
  product: CartProductSnapshot;
};

export type CartRecord = {
  id: string;
  items: CartLineRecord[];
};
