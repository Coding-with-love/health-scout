import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Health Scout",
  description: "How healthy is your food?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >{children}</body>
    </html>
  );
}
