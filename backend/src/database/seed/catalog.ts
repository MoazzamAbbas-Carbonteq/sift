import type { ReviewTheme } from '../../modules/products/infrastructure/persistence/review-theme.js';

export type CategorySlug =
  | 'headphones'
  | 'laptops'
  | 'smartphones'
  | 'monitors'
  | 'keyboards';

export type CatalogAttribute =
  | { kind: 'string'; key: string; value: string }
  | { kind: 'number'; key: string; value: number }
  | { kind: 'boolean'; key: string; value: boolean };

export type CatalogProduct = {
  slug: string;
  name: string;
  brand: string;
  description: string;
  priceCents: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  freeShipping: boolean;
  returnDays: number;
  categorySlug: CategorySlug;
  useCases: string[];
  attributes: CatalogAttribute[];
  features: string[];
  positiveThemes: ReviewTheme[];
  negativeThemes: ReviewTheme[];
};

const str = (key: string, value: string): CatalogAttribute => ({
  kind: 'string',
  key,
  value,
});
const num = (key: string, value: number): CatalogAttribute => ({
  kind: 'number',
  key,
  value,
});
const bool = (key: string, value: boolean): CatalogAttribute => ({
  kind: 'boolean',
  key,
  value,
});
const theme = (label: string, percentage: number): ReviewTheme => ({
  label,
  percentage,
});

type ProductDraft = Omit<
  CatalogProduct,
  'inStock' | 'freeShipping' | 'returnDays'
> &
  Partial<Pick<CatalogProduct, 'inStock' | 'freeShipping' | 'returnDays'>>;

function product(draft: ProductDraft): CatalogProduct {
  return {
    inStock: true,
    freeShipping: true,
    returnDays: 30,
    ...draft,
  };
}

export const CATALOG: CatalogProduct[] = [
  product({
    slug: 'sony-wh-1000xm5',
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    description:
      'Over-ear wireless headphones with adaptive noise cancellation for long flights and open offices. Multipoint Bluetooth keeps a laptop and phone connected at the same time.',
    priceCents: 39999,
    rating: 4.6,
    reviewCount: 18420,
    categorySlug: 'headphones',
    useCases: ['travel', 'work'],
    attributes: [
      bool('noise_cancellation', true),
      num('battery_hours', 30),
      num('weight_grams', 250),
      num('bluetooth_version', 5.2),
      bool('multipoint', true),
      str('form_factor', 'over_ear'),
    ],
    features: ['30-hour battery', 'Adaptive noise cancelling', 'Multipoint Bluetooth'],
    positiveThemes: [theme('Sound quality', 84), theme('Comfort', 76)],
    negativeThemes: [theme('Case is bulky', 18)],
  }),
  product({
    slug: 'bose-quietcomfort-ultra',
    name: 'Bose QuietComfort Ultra Headphones',
    brand: 'Bose',
    description:
      'QuietComfort Ultra is built for travel days when cabin noise should disappear. The over-ear fit stays comfortable on a cross-country flight.',
    priceCents: 42900,
    rating: 4.5,
    reviewCount: 9320,
    categorySlug: 'headphones',
    useCases: ['travel', 'work'],
    attributes: [
      bool('noise_cancellation', true),
      num('battery_hours', 24),
      num('weight_grams', 250),
      num('bluetooth_version', 5.3),
      bool('multipoint', true),
      str('form_factor', 'over_ear'),
    ],
    features: ['Strong noise cancelling', '24-hour battery', 'Plush ear cushions'],
    positiveThemes: [theme('Noise cancelling', 88), theme('Comfort', 81)],
    negativeThemes: [theme('Premium price', 22)],
  }),
  product({
    slug: 'apple-airpods-pro-2',
    name: 'Apple AirPods Pro 2',
    brand: 'Apple',
    description:
      'In-ear buds with active noise cancellation and a small charging case. A good fit for commuting and workouts when over-ear headphones are too much.',
    priceCents: 24900,
    rating: 4.7,
    reviewCount: 42110,
    returnDays: 14,
    categorySlug: 'headphones',
    useCases: ['travel', 'fitness'],
    attributes: [
      bool('noise_cancellation', true),
      num('battery_hours', 6),
      num('weight_grams', 51),
      num('bluetooth_version', 5.3),
      bool('multipoint', false),
      str('form_factor', 'in_ear'),
    ],
    features: ['Light in-ear fit', 'Active noise cancelling', 'Pocketable case'],
    positiveThemes: [theme('Portability', 86), theme('Noise cancelling', 79)],
    negativeThemes: [theme('Short bud battery', 24)],
  }),
  product({
    slug: 'sennheiser-momentum-4',
    name: 'Sennheiser Momentum 4 Wireless',
    brand: 'Sennheiser',
    description:
      'Momentum 4 favors battery life and a warm sound signature for workdays that run long. Noise cancellation is present without the heaviest travel-can feel.',
    priceCents: 34995,
    rating: 4.4,
    reviewCount: 4102,
    categorySlug: 'headphones',
    useCases: ['work', 'travel'],
    attributes: [
      bool('noise_cancellation', true),
      num('battery_hours', 60),
      num('weight_grams', 293),
      num('bluetooth_version', 5.2),
      bool('multipoint', true),
      str('form_factor', 'over_ear'),
    ],
    features: ['60-hour battery', 'Warm sound', 'Multipoint pairing'],
    positiveThemes: [theme('Battery life', 91), theme('Sound quality', 80)],
    negativeThemes: [theme('Heavier than rivals', 19)],
  }),
  product({
    slug: 'jbl-tune-510bt',
    name: 'JBL Tune 510BT',
    brand: 'JBL',
    description:
      'A lightweight on-ear headphone for calls and playlists when noise cancellation is not the priority. The price stays under a typical commute budget.',
    priceCents: 4995,
    rating: 4.2,
    reviewCount: 15680,
    categorySlug: 'headphones',
    useCases: ['work', 'fitness'],
    attributes: [
      bool('noise_cancellation', false),
      num('battery_hours', 40),
      num('weight_grams', 160),
      num('bluetooth_version', 5.0),
      bool('multipoint', false),
      str('form_factor', 'on_ear'),
    ],
    features: ['Under $50', '40-hour battery', 'Lightweight on-ear fit'],
    positiveThemes: [theme('Value', 82), theme('Battery life', 74)],
    negativeThemes: [theme('Sound leaks', 28)],
  }),
  product({
    slug: 'anker-soundcore-space-q45',
    name: 'Anker Soundcore Space Q45',
    brand: 'Anker',
    description:
      'Space Q45 brings adaptive noise cancellation and a long charge to a mid-range price. It is aimed at people who want travel features without a flagship budget.',
    priceCents: 14999,
    rating: 4.3,
    reviewCount: 22140,
    categorySlug: 'headphones',
    useCases: ['travel', 'work'],
    attributes: [
      bool('noise_cancellation', true),
      num('battery_hours', 50),
      num('weight_grams', 298),
      num('bluetooth_version', 5.3),
      bool('multipoint', true),
      str('form_factor', 'over_ear'),
    ],
    features: ['50-hour battery', 'Adaptive noise cancelling', 'Mid-range price'],
    positiveThemes: [theme('Value', 85), theme('Battery life', 83)],
    negativeThemes: [theme('Bulky earcups', 16)],
  }),
  product({
    slug: 'sony-inzone-h9',
    name: 'Sony INZONE H9',
    brand: 'Sony',
    description:
      'INZONE H9 is a wireless gaming headset with noise cancellation for late-night sessions. A boom mic and low-latency dongle are the point, not commute size.',
    priceCents: 29800,
    rating: 4.1,
    reviewCount: 1876,
    freeShipping: false,
    returnDays: 15,
    categorySlug: 'headphones',
    useCases: ['gaming'],
    attributes: [
      bool('noise_cancellation', true),
      num('battery_hours', 32),
      num('weight_grams', 330),
      num('bluetooth_version', 5.0),
      bool('multipoint', false),
      str('form_factor', 'over_ear'),
    ],
    features: ['Gaming mic', '32-hour battery', 'Noise cancelling'],
    positiveThemes: [theme('Game audio', 78), theme('Mic clarity', 71)],
    negativeThemes: [theme('Weight', 26)],
  }),
  product({
    slug: 'jabra-elite-8-active',
    name: 'Jabra Elite 8 Active',
    brand: 'Jabra',
    description:
      'Elite 8 Active is a secure in-ear bud for runs and gym sessions, with noise cancellation when the room is loud. Military-grade durability is the reason to pick it over a commute bud.',
    priceCents: 19999,
    rating: 4.4,
    reviewCount: 2560,
    inStock: false,
    categorySlug: 'headphones',
    useCases: ['fitness'],
    attributes: [
      bool('noise_cancellation', true),
      num('battery_hours', 8),
      num('weight_grams', 36),
      num('bluetooth_version', 5.3),
      bool('multipoint', true),
      str('form_factor', 'in_ear'),
    ],
    features: ['Secure sport fit', 'ShakeGrip coating', 'Noise cancelling'],
    positiveThemes: [theme('Workout fit', 87), theme('Durability', 73)],
    negativeThemes: [theme('Ear tip sizes', 15)],
  }),
  product({
    slug: 'apple-macbook-air-13-m3',
    name: 'Apple MacBook Air 13-inch M3',
    brand: 'Apple',
    description:
      'A thin 13-inch laptop for writing, browsing, and light creative work. The M3 configuration here has 16 GB of memory and 512 GB of storage.',
    priceCents: 129900,
    rating: 4.8,
    reviewCount: 8900,
    returnDays: 14,
    categorySlug: 'laptops',
    useCases: ['work', 'travel'],
    attributes: [
      num('ram_gb', 16),
      num('storage_gb', 512),
      num('screen_inches', 13.6),
      num('weight_kg', 1.24),
    ],
    features: ['16 GB memory', 'All-day battery', '1.24 kg'],
    positiveThemes: [theme('Battery life', 90), theme('Build quality', 86)],
    negativeThemes: [theme('Limited ports', 21)],
  }),
  product({
    slug: 'dell-xps-14',
    name: 'Dell XPS 14',
    brand: 'Dell',
    description:
      'XPS 14 is a compact Windows laptop with a sharp display for office work and photo editing. This configuration pairs 16 GB of memory with a 512 GB SSD.',
    priceCents: 164900,
    rating: 4.4,
    reviewCount: 2100,
    categorySlug: 'laptops',
    useCases: ['work'],
    attributes: [
      num('ram_gb', 16),
      num('storage_gb', 512),
      num('screen_inches', 14.5),
      num('weight_kg', 1.68),
    ],
    features: ['14.5-inch display', '16 GB memory', '512 GB SSD'],
    positiveThemes: [theme('Display', 84), theme('Keyboard', 70)],
    negativeThemes: [theme('Fan noise under load', 23)],
  }),
  product({
    slug: 'lenovo-thinkpad-x1-carbon-gen-12',
    name: 'Lenovo ThinkPad X1 Carbon Gen 12',
    brand: 'Lenovo',
    description:
      'A business ultrabook with a familiar ThinkPad keyboard and a light chassis for people who travel with a laptop every week. This unit has 32 GB of memory and 1 TB of storage.',
    priceCents: 178900,
    rating: 4.6,
    reviewCount: 1540,
    categorySlug: 'laptops',
    useCases: ['work', 'travel'],
    attributes: [
      num('ram_gb', 32),
      num('storage_gb', 1024),
      num('screen_inches', 14),
      num('weight_kg', 1.12),
    ],
    features: ['1.12 kg chassis', '32 GB memory', '1 TB SSD'],
    positiveThemes: [theme('Keyboard', 92), theme('Portability', 85)],
    negativeThemes: [theme('Price', 20)],
  }),
  product({
    slug: 'asus-rog-zephyrus-g14',
    name: 'ASUS ROG Zephyrus G14',
    brand: 'ASUS',
    description:
      'Zephyrus G14 is a 14-inch gaming laptop that still fits in a commuter bag. It is for people who want a discrete GPU without a full-size desktop replacement.',
    priceCents: 159900,
    rating: 4.5,
    reviewCount: 3200,
    categorySlug: 'laptops',
    useCases: ['gaming'],
    attributes: [
      num('ram_gb', 16),
      num('storage_gb', 1024),
      num('screen_inches', 14),
      num('weight_kg', 1.5),
    ],
    features: ['14-inch gaming screen', '1 TB SSD', 'Compact chassis'],
    positiveThemes: [theme('Performance', 86), theme('Size for a gaming laptop', 77)],
    negativeThemes: [theme('Runs warm', 29)],
  }),
  product({
    slug: 'acer-aspire-5',
    name: 'Acer Aspire 5',
    brand: 'Acer',
    description:
      'Aspire 5 is a straightforward 15.6-inch laptop for coursework and household browsing. The configuration keeps the price down with 8 GB of memory and a 512 GB SSD.',
    priceCents: 54999,
    rating: 4.1,
    reviewCount: 6400,
    freeShipping: false,
    categorySlug: 'laptops',
    useCases: ['school', 'work'],
    attributes: [
      num('ram_gb', 8),
      num('storage_gb', 512),
      num('screen_inches', 15.6),
      num('weight_kg', 1.8),
    ],
    features: ['15.6-inch screen', '512 GB SSD', 'Budget price'],
    positiveThemes: [theme('Value', 80), theme('Screen size', 68)],
    negativeThemes: [theme('8 GB feels tight', 31)],
  }),
  product({
    slug: 'framework-laptop-13',
    name: 'Framework Laptop 13',
    brand: 'Framework',
    description:
      'Framework Laptop 13 is a repairable 13-inch notebook with swappable ports. It suits someone who wants to replace memory, storage, or a worn keyboard later.',
    priceCents: 119900,
    rating: 4.3,
    reviewCount: 980,
    inStock: false,
    categorySlug: 'laptops',
    useCases: ['work'],
    attributes: [
      num('ram_gb', 16),
      num('storage_gb', 512),
      num('screen_inches', 13.5),
      num('weight_kg', 1.3),
    ],
    features: ['Repairable design', 'Swappable ports', '16 GB memory'],
    positiveThemes: [theme('Repairability', 89), theme('Keyboard', 74)],
    negativeThemes: [theme('Fewer ready configs', 17)],
  }),
  product({
    slug: 'apple-iphone-16',
    name: 'Apple iPhone 16',
    brand: 'Apple',
    description:
      'iPhone 16 is the everyday Apple phone with a 6.1-inch screen and 128 GB of storage. Pick it when you want a compact phone and long software support.',
    priceCents: 79900,
    rating: 4.7,
    reviewCount: 15200,
    returnDays: 14,
    categorySlug: 'smartphones',
    useCases: ['everyday'],
    attributes: [
      num('storage_gb', 128),
      num('screen_inches', 6.1),
      num('battery_mah', 3561),
    ],
    features: ['6.1-inch screen', '128 GB storage', 'USB-C charging'],
    positiveThemes: [theme('Camera', 86), theme('Software support', 84)],
    negativeThemes: [theme('Base storage', 19)],
  }),
  product({
    slug: 'samsung-galaxy-s24',
    name: 'Samsung Galaxy S24',
    brand: 'Samsung',
    description:
      'Galaxy S24 is a compact Android flagship with a bright 6.2-inch display. The 128 GB model is the one stocked here for people who do not want a large phone.',
    priceCents: 79900,
    rating: 4.6,
    reviewCount: 9800,
    categorySlug: 'smartphones',
    useCases: ['everyday'],
    attributes: [
      num('storage_gb', 128),
      num('screen_inches', 6.2),
      num('battery_mah', 4000),
    ],
    features: ['Bright 6.2-inch display', '128 GB storage', 'Compact flagship'],
    positiveThemes: [theme('Display', 88), theme('Size', 75)],
    negativeThemes: [theme('Charging speed', 14)],
  }),
  product({
    slug: 'google-pixel-9',
    name: 'Google Pixel 9',
    brand: 'Google',
    description:
      'Pixel 9 is for people who care most about camera processing and a clean Android install. This 128 GB model has a 6.3-inch screen.',
    priceCents: 79900,
    rating: 4.5,
    reviewCount: 5400,
    categorySlug: 'smartphones',
    useCases: ['photo', 'everyday'],
    attributes: [
      num('storage_gb', 128),
      num('screen_inches', 6.3),
      num('battery_mah', 4700),
    ],
    features: ['Camera-first software', '6.3-inch screen', '128 GB storage'],
    positiveThemes: [theme('Camera', 90), theme('Software updates', 82)],
    negativeThemes: [theme('Charging brick not included', 11)],
  }),
  product({
    slug: 'oneplus-12',
    name: 'OnePlus 12',
    brand: 'OnePlus',
    description:
      'OnePlus 12 puts a large battery and 256 GB of storage in a 6.8-inch phone. It is the pick when screen size and charge speed matter more than a small pocket fit.',
    priceCents: 69900,
    rating: 4.4,
    reviewCount: 3100,
    returnDays: 15,
    categorySlug: 'smartphones',
    useCases: ['everyday'],
    attributes: [
      num('storage_gb', 256),
      num('screen_inches', 6.8),
      num('battery_mah', 5400),
    ],
    features: ['5400 mAh battery', '256 GB storage', 'Fast charging'],
    positiveThemes: [theme('Battery life', 84), theme('Charging speed', 80)],
    negativeThemes: [theme('Large phone', 22)],
  }),
  product({
    slug: 'motorola-moto-g-power-2025',
    name: 'Motorola Moto G Power (2025)',
    brand: 'Motorola',
    description:
      'Moto G Power is a budget phone built around a large battery and a 6.7-inch screen. It is for people who want multi-day endurance more than a flagship camera.',
    priceCents: 29900,
    rating: 4.2,
    reviewCount: 7200,
    returnDays: 14,
    categorySlug: 'smartphones',
    useCases: ['battery', 'everyday'],
    attributes: [
      num('storage_gb', 128),
      num('screen_inches', 6.7),
      num('battery_mah', 5000),
    ],
    features: ['5000 mAh battery', 'Budget price', '6.7-inch screen'],
    positiveThemes: [theme('Battery life', 88), theme('Value', 79)],
    negativeThemes: [theme('Camera in low light', 27)],
  }),
  product({
    slug: 'nothing-phone-2',
    name: 'Nothing Phone (2)',
    brand: 'Nothing',
    description:
      'Phone (2) is a 6.7-inch Android phone with a transparent back and glyph lights. The 256 GB model is for someone who wants a distinctive design at a mid-range price.',
    priceCents: 59900,
    rating: 4.3,
    reviewCount: 2600,
    inStock: false,
    categorySlug: 'smartphones',
    useCases: ['everyday'],
    attributes: [
      num('storage_gb', 256),
      num('screen_inches', 6.7),
      num('battery_mah', 4700),
    ],
    features: ['Glyph light alerts', '256 GB storage', '6.7-inch display'],
    positiveThemes: [theme('Design', 86), theme('Software feel', 72)],
    negativeThemes: [theme('Glyph lights are optional', 13)],
  }),
  product({
    slug: 'dell-ultrasharp-u2723qe',
    name: 'Dell UltraSharp U2723QE',
    brand: 'Dell',
    description:
      'A 27-inch 4K IPS monitor for spreadsheets, documents, and photo review. USB-C power delivery means one cable can charge a laptop while you work.',
    priceCents: 57900,
    rating: 4.6,
    reviewCount: 2100,
    categorySlug: 'monitors',
    useCases: ['work'],
    attributes: [
      num('screen_inches', 27),
      str('resolution', '3840x2160'),
      num('refresh_rate_hz', 60),
      str('panel', 'IPS'),
    ],
    features: ['27-inch 4K', 'IPS panel', 'USB-C docking'],
    positiveThemes: [theme('Sharp text', 89), theme('Color accuracy', 78)],
    negativeThemes: [theme('Stand is deep', 12)],
  }),
  product({
    slug: 'lg-ultragear-27gp850-b',
    name: 'LG UltraGear 27GP850-B',
    brand: 'LG',
    description:
      'A 27-inch 1440p monitor with a 165 Hz refresh rate for competitive games. Nano IPS keeps colors stable when you move off-center.',
    priceCents: 34900,
    rating: 4.5,
    reviewCount: 4800,
    categorySlug: 'monitors',
    useCases: ['gaming'],
    attributes: [
      num('screen_inches', 27),
      str('resolution', '2560x1440'),
      num('refresh_rate_hz', 165),
      str('panel', 'IPS'),
    ],
    features: ['165 Hz refresh', '1440p resolution', '1 ms response'],
    positiveThemes: [theme('Motion clarity', 86), theme('Colors', 74)],
    negativeThemes: [theme('HDR is limited', 18)],
  }),
  product({
    slug: 'samsung-odyssey-g7-32',
    name: 'Samsung Odyssey G7 32',
    brand: 'Samsung',
    description:
      'Odyssey G7 is a 32-inch curved 1440p display with a 240 Hz refresh rate. It is the large, fast option for people who sit close to a single gaming screen.',
    priceCents: 59900,
    rating: 4.3,
    reviewCount: 1900,
    returnDays: 15,
    categorySlug: 'monitors',
    useCases: ['gaming'],
    attributes: [
      num('screen_inches', 32),
      str('resolution', '2560x1440'),
      num('refresh_rate_hz', 240),
      str('panel', 'VA'),
    ],
    features: ['240 Hz refresh', '32-inch curve', '1440p resolution'],
    positiveThemes: [theme('Refresh rate', 84), theme('Contrast', 76)],
    negativeThemes: [theme('Curve is strong', 25)],
  }),
  product({
    slug: 'benq-gw2480',
    name: 'BenQ GW2480',
    brand: 'BenQ',
    description:
      'GW2480 is a 24-inch 1080p office monitor with eye-care modes and a simple stand. It is the inexpensive second screen, not a color-critical display.',
    priceCents: 12900,
    rating: 4.2,
    reviewCount: 8600,
    freeShipping: false,
    categorySlug: 'monitors',
    useCases: ['work'],
    attributes: [
      num('screen_inches', 24),
      str('resolution', '1920x1080'),
      num('refresh_rate_hz', 60),
      str('panel', 'IPS'),
    ],
    features: ['24-inch 1080p', 'Eye-care modes', 'Low price'],
    positiveThemes: [theme('Value', 83), theme('Easy setup', 71)],
    negativeThemes: [theme('1080p looks soft', 20)],
  }),
  product({
    slug: 'asus-proart-pa278cv',
    name: 'ASUS ProArt PA278CV',
    brand: 'ASUS',
    description:
      'ProArt PA278CV is a 27-inch 1440p monitor calibrated for photo and design work. USB-C makes it a practical external display for a laptop.',
    priceCents: 42900,
    rating: 4.6,
    reviewCount: 740,
    categorySlug: 'monitors',
    useCases: ['creative', 'work'],
    attributes: [
      num('screen_inches', 27),
      str('resolution', '2560x1440'),
      num('refresh_rate_hz', 75),
      str('panel', 'IPS'),
    ],
    features: ['Factory calibrated', '27-inch 1440p', 'USB-C input'],
    positiveThemes: [theme('Color accuracy', 88), theme('USB-C convenience', 70)],
    negativeThemes: [theme('Not for high refresh gaming', 9)],
  }),
  product({
    slug: 'keychron-q1-pro',
    name: 'Keychron Q1 Pro',
    brand: 'Keychron',
    description:
      'Q1 Pro is a wireless 75 percent mechanical keyboard with a gasket mount and a rotary knob. It is for a desk where typing feel matters and a number pad does not.',
    priceCents: 19900,
    rating: 4.6,
    reviewCount: 3400,
    categorySlug: 'keyboards',
    useCases: ['work'],
    attributes: [
      str('switch_type', 'brown'),
      str('layout', 'seventy_five'),
      bool('wireless', true),
    ],
    features: ['75% layout', 'Wireless', 'Gasket mount'],
    positiveThemes: [theme('Typing feel', 87), theme('Build', 82)],
    negativeThemes: [theme('Heavy to carry', 16)],
  }),
  product({
    slug: 'logitech-mx-keys',
    name: 'Logitech MX Keys',
    brand: 'Logitech',
    description:
      'MX Keys is a low-profile full-size keyboard for people who type all day and switch between a computer and a tablet. Scissor switches stay quiet in an office.',
    priceCents: 9999,
    rating: 4.5,
    reviewCount: 22000,
    categorySlug: 'keyboards',
    useCases: ['work'],
    attributes: [
      str('switch_type', 'scissor'),
      str('layout', 'full'),
      bool('wireless', true),
    ],
    features: ['Full-size layout', 'Quiet keys', 'Multi-device pairing'],
    positiveThemes: [theme('Typing comfort', 84), theme('Quiet keys', 79)],
    negativeThemes: [theme('Not a mechanical feel', 18)],
  }),
  product({
    slug: 'razer-blackwidow-v4',
    name: 'Razer BlackWidow V4',
    brand: 'Razer',
    description:
      'BlackWidow V4 is a wired full-size mechanical keyboard with clicky switches and dedicated media controls. It is aimed at a gaming desk, not a shared office.',
    priceCents: 16999,
    rating: 4.2,
    reviewCount: 4100,
    categorySlug: 'keyboards',
    useCases: ['gaming'],
    attributes: [
      str('switch_type', 'clicky'),
      str('layout', 'full'),
      bool('wireless', false),
    ],
    features: ['Clicky switches', 'Full-size layout', 'Media controls'],
    positiveThemes: [theme('Gaming features', 76), theme('Switch feedback', 73)],
    negativeThemes: [theme('Loud switches', 34)],
  }),
  product({
    slug: 'nuphy-air75-v2',
    name: 'NuPhy Air75 V2',
    brand: 'NuPhy',
    description:
      'Air75 V2 is a low-profile 75 percent keyboard that is light enough to travel with a laptop. Wireless modes cover a desk at home and a bag on the road.',
    priceCents: 12999,
    rating: 4.4,
    reviewCount: 1800,
    categorySlug: 'keyboards',
    useCases: ['travel', 'work'],
    attributes: [
      str('switch_type', 'low_profile'),
      str('layout', 'seventy_five'),
      bool('wireless', true),
    ],
    features: ['Low-profile switches', 'Travel weight', '75% layout'],
    positiveThemes: [theme('Portability', 88), theme('Typing sound', 71)],
    negativeThemes: [theme('Low-profile feel', 14)],
  }),
  product({
    slug: 'leopold-fc660m',
    name: 'Leopold FC660M',
    brand: 'Leopold',
    description:
      'FC660M is a compact wired mechanical keyboard with a 65 percent layout and dye-sublimated keycaps. It is a quiet desk board for people who do not need wireless.',
    priceCents: 10900,
    rating: 4.7,
    reviewCount: 960,
    freeShipping: false,
    returnDays: 15,
    categorySlug: 'keyboards',
    useCases: ['work'],
    attributes: [
      str('switch_type', 'red'),
      str('layout', 'sixty_five'),
      bool('wireless', false),
    ],
    features: ['65% layout', 'PBT keycaps', 'Linear red switches'],
    positiveThemes: [theme('Build quality', 90), theme('Keycaps', 81)],
    negativeThemes: [theme('No wireless', 17)],
  }),
];
