import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Showcase",
  description: "Showing what I can do!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={syne.className}>
        {children}
      </body>
    </html>
  );
}
