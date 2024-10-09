import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";

import { Thema } from "./styles/Thema";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyChatbot",
  description: "Generated by MetalMental",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <Providers>
        <body className={`flex flex-col min-h-screen ${inter.className}`}>
          <Login>
            <Header />
            <Thema>
              <div className="flex-grow">{children}</div>
            </Thema>
            <Footer />
          </Login>
        </body>
      </Providers>
    </html>
  );
}
