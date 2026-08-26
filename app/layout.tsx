import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "LOOP — Customer Feedback Intelligence",
  description: "AI-Powered Customer Feedback Intelligence Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
