import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/layout/site-header";
import { getQueryClient } from "@/lib/query-client";
import { cn } from "@/lib/utils";
import { prefetchCart } from "@/server/prefetch/cart";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Sift",
    template: "%s · Sift",
  },
  description: "Find the right product faster and with less noise.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const queryClient = getQueryClient();
  await prefetchCart(queryClient);

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-background text-foreground">
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <SiteHeader />
            <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}
