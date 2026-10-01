"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductImage({
  src,
  alt,
  priority = false,
  sizes,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
}) {
  const [failed, setFailed] = useState(false);
  const unavailable = failed || src.trim().length === 0;

  return (
    <div className="relative aspect-square overflow-hidden bg-muted">
      {unavailable ? (
        <p className="flex h-full items-center justify-center px-3 text-center text-sm text-muted-foreground">
          Image unavailable
        </p>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
