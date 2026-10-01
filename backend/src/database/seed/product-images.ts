const UNSPLASH = 'https://images.unsplash.com';

/**
 * Square Unsplash crops chosen so each card shows the product category
 * (headphones, earbuds, a laptop, and so on) instead of a random landscape.
 */
const PRODUCT_IMAGE_IDS: Record<string, string> = {
  'sony-wh-1000xm5': 'photo-1618366712010-f4ae9c647dcb',
  'bose-quietcomfort-ultra': 'photo-1546435770-a3e426bf472b',
  'apple-airpods-pro-2': 'photo-1590658268037-6bf12165a8df',
  'sennheiser-momentum-4': 'photo-1487215078519-e21cc028cb29',
  'jbl-tune-510bt': 'photo-1583394838336-acd977736f90',
  'anker-soundcore-space-q45': 'photo-1612444530582-fc66183b16f7',
  'sony-inzone-h9': 'photo-1673669231301-09baa4d7761b',
  'jabra-elite-8-active': 'photo-1606220945770-b5b6c2c55bf1',
  'apple-macbook-air-13-m3': 'photo-1541807084-5c52b6b3adef',
  'dell-xps-14': 'photo-1588872657578-7efd1f1555ed',
  'lenovo-thinkpad-x1-carbon-gen-12': 'photo-1593642632823-8f785ba67e45',
  'asus-rog-zephyrus-g14': 'photo-1603302576837-37561b2e2302',
  'acer-aspire-5': 'photo-1496181133206-80ce9b88a853',
  'framework-laptop-13': 'photo-1525547719571-a2d4ac8945e2',
  'apple-iphone-16': 'photo-1580910051074-3eb694886505',
  'samsung-galaxy-s24': 'photo-1598327105666-5b89351aff97',
  'google-pixel-9': 'photo-1601784551446-20c9e07cdbdb',
  'oneplus-12': 'photo-1614020661596-366a1afbb319',
  'motorola-moto-g-power-2025': 'photo-1510557880182-3d4d3cba35a5',
  'nothing-phone-2': 'photo-1511707171634-5f897ff02aa9',
  'dell-ultrasharp-u2723qe': 'photo-1616763355548-1b606f439f86',
  'lg-ultragear-27gp850-b': 'photo-1547119957-637f8679db1e',
  'samsung-odyssey-g7-32': 'photo-1759158963837-ce2f1524b813',
  'benq-gw2480': 'photo-1586210579191-33b45e38fa2c',
  'asus-proart-pa278cv': 'photo-1614624532983-4ce03382d63d',
  'keychron-q1-pro': 'photo-1595044426077-d36d9236d54a',
  'logitech-mx-keys': 'photo-1561112078-7d24e04c3407',
  'razer-blackwidow-v4': 'photo-1629429407759-01cd3d7cfb38',
  'nuphy-air75-v2': 'photo-1589578228447-e1a4e481c6c8',
  'leopold-fc660m': 'photo-1618384887929-16ec33fab9ef',
};

export function productImageUrl(slug: string): string {
  const id = PRODUCT_IMAGE_IDS[slug];
  if (!id) {
    throw new Error(`Missing product image for ${slug}.`);
  }

  return `${UNSPLASH}/${id}?auto=format&fit=crop&w=800&h=800&q=80`;
}
