import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vellui One",
  description: "Sistema Multitenant Profissional",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="antialiased bg-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}