import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Algorithms Playground",
  description: "Interactive algorithms visualization and implementation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-blue-600 text-white p-4">
            <h1 className="text-2xl font-bold">Algorithms Playground</h1>
          </header>
          <main className="container mx-auto p-4">{children}</main>
          <footer className="bg-gray-200 p-4 text-center">
            © 2024 Algorithms Playground
          </footer>
        </div>
      </body>
    </html>
  );
}
