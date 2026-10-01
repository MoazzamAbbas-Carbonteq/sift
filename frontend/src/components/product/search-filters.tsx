"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  categoryAttributeFilters,
  pricePresets,
  ratingPresets,
} from "@/lib/catalog-filters";
import type { Category, ProductQuery } from "@/lib/api/products";

export function SearchFilters({
  query,
  categories,
  idPrefix,
  onChange,
}: {
  query: ProductQuery;
  categories: Category[];
  idPrefix: string;
  onChange: (query: ProductQuery) => void;
}) {
  const attributeGroups = query.category
    ? (categoryAttributeFilters[query.category] ?? [])
    : [];
  const selectedAttributes = new Set(query.attribute ?? []);

  function commit(next: ProductQuery) {
    onChange(next);
  }

  function withoutPage(next: ProductQuery): ProductQuery {
    const copy = { ...next };
    delete copy.page;
    return copy;
  }

  return (
    <div className="flex flex-col gap-6">
      <FilterGroup label="Category">
        <Button
          type="button"
          size="sm"
          variant={query.category ? "outline" : "default"}
          onClick={() => {
            const next = withoutPage({ ...query });
            delete next.category;
            delete next.attribute;
            commit(next);
          }}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            type="button"
            size="sm"
            variant={query.category === category.slug ? "default" : "outline"}
            onClick={() => {
              const next = withoutPage({ ...query, category: category.slug });
              delete next.attribute;
              commit(next);
            }}
          >
            {category.name}
          </Button>
        ))}
      </FilterGroup>

      <FilterGroup label="Price">
        {pricePresets.map((preset) => {
          const selected =
            query.minPrice === preset.minPrice && query.maxPrice === preset.maxPrice;
          return (
            <Button
              key={preset.label}
              type="button"
              size="sm"
              variant={selected ? "default" : "outline"}
              onClick={() => {
                const next = withoutPage({ ...query });
                if (preset.minPrice === undefined) delete next.minPrice;
                else next.minPrice = preset.minPrice;
                if (preset.maxPrice === undefined) delete next.maxPrice;
                else next.maxPrice = preset.maxPrice;
                commit(next);
              }}
            >
              {preset.label}
            </Button>
          );
        })}
      </FilterGroup>

      <FilterGroup label="Rating">
        {ratingPresets.map((preset) => (
          <Button
            key={preset.label}
            type="button"
            size="sm"
            variant={query.minRating === preset.minRating ? "default" : "outline"}
            onClick={() => {
              const next = withoutPage({ ...query });
              if (preset.minRating === undefined) delete next.minRating;
              else next.minRating = preset.minRating;
              commit(next);
            }}
          >
            {preset.label}
          </Button>
        ))}
      </FilterGroup>

      <div className="flex flex-col gap-3">
        <CheckField
          id={`${idPrefix}-in-stock`}
          label="In stock"
          checked={query.inStock === true}
          onCheckedChange={(checked) => {
            const next = withoutPage({ ...query });
            if (checked) next.inStock = true;
            else delete next.inStock;
            commit(next);
          }}
        />
        <CheckField
          id={`${idPrefix}-free-shipping`}
          label="Free shipping"
          checked={query.freeShipping === true}
          onCheckedChange={(checked) => {
            const next = withoutPage({ ...query });
            if (checked) next.freeShipping = true;
            else delete next.freeShipping;
            commit(next);
          }}
        />
      </div>

      {attributeGroups.map((group) => (
        <div key={group.label} className="flex flex-col gap-3">
          <p className="text-sm font-medium">{group.label}</p>
          {group.options.map((option) => (
            <CheckField
              key={option.value}
              id={`${idPrefix}-${option.value}`}
              label={option.label}
              checked={selectedAttributes.has(option.value)}
              onCheckedChange={(checked) => {
                const nextAttributes = new Set(query.attribute ?? []);
                if (checked) nextAttributes.add(option.value);
                else nextAttributes.delete(option.value);
                const next = withoutPage({ ...query });
                if (nextAttributes.size === 0) delete next.attribute;
                else next.attribute = [...nextAttributes].sort();
                commit(next);
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function CheckField({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}
