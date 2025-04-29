// import "@coinbase/onchainkit/styles.css";
import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { fontVariables } from "@/components/ui/fonts";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const title = "blobspace.fun";
const description = "Explore Ethereum Blobs";
const keywords = [
  "Ethereum Blobs",
  "blobspace.fun",
  "Ethereum",
  "Blobs",
  "Blobspace",
  "Blob",
  "Blobspace.fun",
];
const image = "/preview.png";
const alt = "blobspace.fun";
const url = "https://www.blobspace.fun";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  keywords,
  openGraph: {
    title,
    description,
    url,
    siteName: "blobspace.fun",
    type: "website",
    images: [
      {
        url: image,
        alt,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@0xmfbevan",
    creator: "@0xmfbevan",
    title,
    description,
    images: [
      {
        url: image,
        alt,
      },
    ],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontVariables} antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
