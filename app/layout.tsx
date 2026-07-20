import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CommandPalette from "@/components/layout/CommandPalette";
import AIAssistant from "@/components/layout/AIAssistant";

export const metadata: Metadata = {
  title: "Freelance Ops Toolkit",
  description: "A collection of independent tools that help freelancers manage client operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-950 dark:text-gray-50 antialiased font-sans transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
          <CommandPalette />
          <AIAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}
