export type AttributeFilterGroup = {
  label: string;
  options: { label: string; value: string }[];
};

export const categoryAttributeFilters: Record<string, AttributeFilterGroup[]> =
  {
    headphones: [
      {
        label: "Features",
        options: [
          { label: "Noise cancellation", value: "noise_cancellation:true" },
          { label: "Multipoint", value: "multipoint:true" },
        ],
      },
      {
        label: "Form",
        options: [
          { label: "Over-ear", value: "form_factor:over_ear" },
          { label: "On-ear", value: "form_factor:on_ear" },
          { label: "In-ear", value: "form_factor:in_ear" },
        ],
      },
    ],
    laptops: [
      {
        label: "Memory",
        options: [
          { label: "8 GB", value: "ram_gb:8" },
          { label: "16 GB", value: "ram_gb:16" },
          { label: "32 GB", value: "ram_gb:32" },
        ],
      },
      {
        label: "Storage",
        options: [
          { label: "512 GB", value: "storage_gb:512" },
          { label: "1 TB", value: "storage_gb:1024" },
        ],
      },
    ],
    smartphones: [
      {
        label: "Storage",
        options: [
          { label: "128 GB", value: "storage_gb:128" },
          { label: "256 GB", value: "storage_gb:256" },
        ],
      },
    ],
    monitors: [
      {
        label: "Panel",
        options: [
          { label: "IPS", value: "panel:IPS" },
          { label: "VA", value: "panel:VA" },
        ],
      },
      {
        label: "Resolution",
        options: [
          { label: "1080p", value: "resolution:1920x1080" },
          { label: "1440p", value: "resolution:2560x1440" },
          { label: "4K", value: "resolution:3840x2160" },
        ],
      },
    ],
    keyboards: [
      {
        label: "Connection",
        options: [{ label: "Wireless", value: "wireless:true" }],
      },
      {
        label: "Layout",
        options: [
          { label: "Full size", value: "layout:full" },
          { label: "75%", value: "layout:seventy_five" },
          { label: "65%", value: "layout:sixty_five" },
        ],
      },
    ],
  };

export const pricePresets = [
  { label: "Any price", minPrice: undefined, maxPrice: undefined },
  { label: "Under $100", minPrice: undefined, maxPrice: 9999 },
  { label: "$100–$200", minPrice: 10000, maxPrice: 20000 },
  { label: "$200–$500", minPrice: 20000, maxPrice: 50000 },
  { label: "$500 and up", minPrice: 50000, maxPrice: undefined },
] as const;

export const ratingPresets = [
  { label: "Any rating", minRating: undefined },
  { label: "4 stars and up", minRating: 4 },
  { label: "3 stars and up", minRating: 3 },
] as const;

export const sortOptions = [
  { value: "rating_desc", label: "Highest rated" },
  { value: "reviews_desc", label: "Most reviewed" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
  { value: "rating_asc", label: "Lowest rated" },
] as const;
